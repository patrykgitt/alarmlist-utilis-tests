export class PlcCommunication {
  constructor(plcRegisters) {
    this.plcRegs = plcRegisters;

    this.PLC_Types = {
      BOOL: "bool",
      INT: "int",
      UINT: "uint",
      DINT: "dint",
      UDINT: "udint",
      REAL: "real"
    };
    this.MapPLC_TypeToSize = new Map();
    this.MapPLC_TypeToSize.set(this.PLC_Types.BOOL, "B");
    this.MapPLC_TypeToSize.set(this.PLC_Types.INT, "W");
    this.MapPLC_TypeToSize.set(this.PLC_Types.UINT, "W");
    this.MapPLC_TypeToSize.set(this.PLC_Types.DINT, "D");
    this.MapPLC_TypeToSize.set(this.PLC_Types.UDINT, "D");
    this.MapPLC_TypeToSize.set(this.PLC_Types.REAL, "D");

    this.parsersMap = new Map();
    this.parsersMap.set(this.PLC_Types.BOOL, this.parseBoolFromHexString);
    this.parsersMap.set(this.PLC_Types.INT, this.parseIntFromHexString);
    this.parsersMap.set(this.PLC_Types.UINT, this.parseUintFromHexString);
    this.parsersMap.set(this.PLC_Types.DINT, this.parseDintFromHexString);
    this.parsersMap.set(this.PLC_Types.UDINT, this.parseUdintFromHexString);
    this.parsersMap.set(this.PLC_Types.REAL, this.parseFloatFromHexString);

    this.parsersToHexMap = new Map();
    this.parsersToHexMap.set(this.PLC_Types.BOOL, this.parseBoolToHexString);
    this.parsersToHexMap.set(this.PLC_Types.INT, this.parseIntToHexString);
    this.parsersToHexMap.set(this.PLC_Types.UINT, this.parseUintToHexString);
    this.parsersToHexMap.set(this.PLC_Types.DINT, this.parseDintToHexString);
    this.parsersToHexMap.set(this.PLC_Types.UDINT, this.parseUdintToHexString);
    this.parsersToHexMap.set(this.PLC_Types.REAL, this.parseFloatToHexString);
  }

  startRegisterRead(refreshTimeMs) {
    setInterval(this.read.bind(this), refreshTimeMs);
  }
  startRegisterWrite(refreshTimeMs) {
    setInterval(this.write.bind(this), refreshTimeMs);
  }
  updateValue(device, value) {
    let index = this.plcRegs.findIndex(obj => {
      return obj.device === device;
    });
    this.plcRegs[index].value = value;
  }
  readFromPLC(
    /* <String, {device, type, elementId}>[] */ dataArray,
    callback,
    callbackError
  ) {
    var obj = this;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/cgi/RdDevRnd.cgi", true); // rnd blk
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    var func = function() {
      obj.callbackMain(xhr, obj, dataArray, callback, callbackError);
    }; //callback i callbackError sa podawane do funkcji
    xhr.onreadystatechange = func;
    xhr.send(this.getRequestStringRead(dataArray));
    //console.log(this.getRequestStringRead(dataArray));
    // xhr timeout
  }

  // 0: 16-bit signed, 1: 16-bit unsigned, 2: 32-bit signed, 3: 32-bit unsigned, 4: Single-precision real number, 6:Bit
  writeToPLC(dataArray, callback, callbackError) {
    var obj = this;
    var xhr;
    var requestString = this.getRequestStringWrite(dataArray);
    if (requestString == null) return null;
    // Request to the CGI
    xhr = new XMLHttpRequest();
    xhr.open("POST", "/cgi/WrDev.cgi", true); //WrDevRnd iQr
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var FUNC = function() {
      obj.callbackMain(xhr, obj, dataArray, callback, callbackError);
    }; // Response analysis function setting
    xhr.onload = FUNC;

    xhr.send(requestString);
    //console.log(requestString);
  }

  callbackMain(xhr, object, dataArray, callback, callbackError) {
    if (4 != xhr.readyState) {
      // End the processing if the status 4 is other than DONE (operation complete).
      return;
    }
    // HTTP Response code check
    if (200 != xhr.status) {
      // Display the error dialog box if the response code is other than "200 OK".
      //alert("HTTP STATUS ERROR=" + xhr.status );
      callbackError(
        "Error:" +
          "XMLHttpRequest.status=" +
          xhr.status +
          " XMLHttpRequest.readyState=" +
          xhr.readyState
      );
      return;
    }
    var errorMessage;
    var res = JSON.parse(xhr.response);
    if (res.RET != "0000") {
      // Display the error dialog box if the result is abnormal.
      if (res.RET == "0001") {
        errorMessage = "Not login!";
        document.location.href = "/system/Log-in.html";
      }
      if (res.RET == "0002") {
        errorMessage =
          "No permission (A user without device write permission executed the CGI.)";
      }
      if (res.RET == "0005") {
        errorMessage = "Incorrect request source (Referer)";
      }
      if (res.RET == "4005") {
        errorMessage = "Exceeded the number of points";
      }
      if (res.RET == "4030") {
        errorMessage = "Incorrect device type";
      }
      if (res.RET == "4031") {
        errorMessage = "Out of device range";
      }
      if (res.RET == "4041") {
        errorMessage =
          "Error due to the specified buffer memory number + specified number of transfer points out of buffer memory range";
      }
      if (res.RET == "4043") {
        errorMessage = "Error due to the specified module not existing";
      }
      if (res.RET == "4080") {
        errorMessage = "CGI parameter error";
      }
      //alert("ERROR=" + res.RET + ": " + errorMessage);
      callbackError("Error:" + errorMessage);
    } else {
      if (!xhr.responseURL.includes("WrDev")) {
        callback(object.parseResponse(dataArray, xhr.response));
      }
    }
  }

  read() {
    this.readFromPLC(
      this.plcRegs,
      this.updateElements,
      this.updateElementsError
    );
    //console.log(plcRegs);
  }
  write() {
    //this.plcRegs[0].value=1;//32767;
    //this.plcRegs[1].value=-2;//2147483647;
    //this.plcRegs[2].value=65535;
    //this.plcRegs[3].value=-2;
    // do usuniecia min max ?
    //this.plcRegs[4].value=4294967295;//4294967295;
    //this.plcRegs[5].value=-1.123;
    this.writeToPLC(
      this.plcRegs,
      this.updateElements,
      this.updateElementsError
    );
  }

  getRequestStringRead(dataArray) {
    var str = "NUM=" + dataArray.length;
    for (let i = 0; i < dataArray.length; i++) {
      str +=
        "&DEV" +
        Number(i + 1) +
        "=" +
        dataArray[i].device +
        "&TYP" +
        Number(i + 1) +
        "=" +
        this.MapPLC_TypeToSize.get(dataArray[i].type);
    }
    return str;
  }

  getRequestStringWrite(dataArray) {
    var registersToSend = [];

    var numberOfRegisters = dataArray.length; //3;
    for (let i = 0; i < numberOfRegisters; i++) {
      if (dataArray[i].hasOwnProperty("value")) {
        if (dataArray[i].value != null) {
          registersToSend.push(dataArray[i]);
        }
      }
    }
    numberOfRegisters = registersToSend.length;
    if (numberOfRegisters == 0) return null;

    var str = "NUM=" + numberOfRegisters;
    var name;
    var number;
    var base;
    for (let i = 0; i < numberOfRegisters; i++) {
      name = registersToSend[i].device.match(/[a-zA-Z]+/);
      number = registersToSend[i].device.match(/[^a-zA-Z]+/);
      if (name == "X" || name == "Y") {
        base = 8;
      } else if (name == "W" || name == "SW") {
        base = 16;
      } else {
        base = 10;
      } //
      str +=
        "&DEV" +
        Number(i + 1) +
        "=" +
        name +
        number.toString(base) +
        "&TYP" +
        Number(i + 1) +
        "=" +
        this.MapPLC_TypeToSize.get(registersToSend[i].type);
      str +=
        "&DATA" +
        Number(i + 1) +
        "=" +
        this.parsersToHexMap.get(registersToSend[i].type)(
          registersToSend[i].value
        );
    }
    for (let i = 0; i < dataArray.length; i++) {
      dataArray[i].value = null;
    }
    return str;
  }

  parseResponse(dataArray, response) {
    let jsonRes = JSON.parse(response);
    let result = [];
    for (let i = 0; i < jsonRes.DATA.length; i++) {
      result[i] = this.parsersMap.get(dataArray[i].type)(jsonRes.DATA[i]);
    }
    return result;
  }

  parseFloatFromHexString(strData) {
    let float = 0,
      sign,
      mantissa,
      exp,
      intValue = 0;

    strData = strData.slice(0, 8);
    intValue = parseInt(strData, 16);

    sign = intValue >>> 31 ? -1 : 1;
    exp = ((intValue >>> 23) & 0xff) - 127;
    mantissa = ((intValue & 0x7fffff) + 0x800000).toString(2);

    for (let i = 0; i < mantissa.length; i += 1) {
      float += parseInt(mantissa[i]) ? Math.pow(2, exp) : 0;
      exp--;
    }

    let result = float * sign;
    return result;
  }

  parseBoolFromHexString(str) {
    return parseInt(str, 16) > 0;
  }

  parseIntFromHexString(str) {
    let int = parseInt(str, 16);
    //console.log(0x8000);
    return int >= 0x8000 ? int - 0x8000 * 2 : int;
  }

  parseUintFromHexString(str) {
    return parseInt(str, 16);
  }

  parseDintFromHexString(str) {
    let int = parseInt(str, 16);
    return int >= 0x80000000 ? int - 0x80000000 * 2 : int;
  }

  parseUdintFromHexString(str) {
    return parseInt(str, 16);
  }

  parseFloatToHexString(numToConvert) {
    var sign = "0";
    numToConvert = numToConvert + 0.000001;

    if (numToConvert < 0.0) {
      sign = "1";
      numToConvert = -numToConvert - 0.000002;
    }

    if (numToConvert == 0) {
      return "0";
    }
    var mantissa = parseFloat(numToConvert).toString(2);

    var exponent = 0;

    if (mantissa.substr(0, 1) === "0") {
      exponent = mantissa.indexOf(".") - mantissa.indexOf("1") + 127;
    } else {
      exponent = mantissa.indexOf(".") - 1 + 127;
    }

    mantissa = mantissa.replace(".", "");
    mantissa = mantissa.substr(mantissa.indexOf("1") + 1);

    if (mantissa.length > 23) {
      mantissa = mantissa.substr(0, 23);
    } else {
      while (mantissa.length < 23) {
        mantissa = mantissa + "0";
      }
    }

    var exp = parseFloat(exponent).toString(2);

    while (exp.length < 8) {
      exp = "0" + exp;
    }

    var numberFull = sign + exp + mantissa;
    return parseInt(numberFull, 2).toString(16);
  }

  parseBoolToHexString(numToConvert) {
    return parseInt(numToConvert).toString(16);
  }

  parseIntToHexString(numToConvert) {
    let int = parseInt(numToConvert);
    //console.log(0x8000);
    if (int < 0) int = 0x10000 + int;
    //(int >= 0x8000) ? int = (int - 0x8000 * 2) : null
    return int.toString(16);
  }

  parseUintToHexString(numToConvert) {
    return parseInt(numToConvert).toString(16);
  }

  parseDintToHexString(numToConvert) {
    let int = parseInt(numToConvert);
    //console.log(0x8000);
    if (int < 0) int = 0x100000000 + int;
    //(int >= 0x8000) ? int = (int - 0x8000 * 2) : null
    return int.toString(16);

    //(int >= 0x80000000) ? int = (int - 0x80000000 * 2) : null
    //return int.toString(16);
  }

  parseUdintToHexString(numToConvert) {
    return parseInt(numToConvert).toString(16);
  }
}
