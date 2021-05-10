export var plcRegs = [
  {
    device: "M0",
    type: "bool",
    elementId: "otwarcie"
  },
  {
    device: "D0",
    type: "int",
    elementId: "czas1"
  },
  {
    device: "D2000",
    type: "uint",
    elementId: "czas4"
  },
  {
    device: "D10",
    type: "dint",
    elementId: "czas2"
  },
  {
    device: "D1000",
    type: "udint",
    elementId: "czas3"
  },
  {
    device: "D20",
    type: "real",
    elementId: "temperatura"
  }
];

//czy plcRegisters do usuniecia?
PlcCommunication.prototype.updateElements = function(data) {
  //jako taka ktora nie modyfikuje dancyh?
  for (let i = 0; i < plcRegs.length; i++) {
    ////document.getElementById(plcRegs[i].elementId).value = data[i];
    //document.getElementById(plcRegs[i].elementId).innerHTML = data[i];
  }
};
PlcCommunication.prototype.updateElementsError = function(errorMsg) {
  //document.getElementById('errorDisplay').innerHTML = errorMsg;
};

function inputValue(device) {
  var index = plcRegs.findIndex(obj => {
    return obj.device === device;
  });
  var value = prompt(
    "Podaj nową wartość zmiennej " + plcRegs[index].elementId + "."
  );
  plcComm.updateValue(device, value);
}
var plcComm = new PlcCommunication(plcRegs);
plcComm.startRegisterRead(1000);
plcComm.startRegisterWrite(2000);

// Tutaj prace trwają byc moze zastapione przez jquery
//PlcCommunication.prototype.registerWriteConfirm = function(data,plcRegisters){
//confirm("Device will be written to device\nAre you sure you want to continue?") && PlcCommunication.registerWrite();
//};

//      try {
//        confirm(formatter(getMsgStr("MSG_WTR_BTN_0002", this.param.language), this.param.devName, this.param.wrVal)) && this.call_WriteDevice()
//  } catch (a) {
//    console.error("confirm : [ " + a.message + " ] " + a.stack)
//} finally {}
