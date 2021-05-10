var plcRegs = [
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

export function my() {
  return 3;
}
