
const colors = [
  "#093145",
  "#107896",
  "#829356",
  "#0C374D",
  "#1287A8",
  "#93A661",
  "#0D3D56",
  "#1496BB",
  "#A3B86C",
  "#3C6478",
  "#43ABC9",
  "#B5C689",
  "#BCA136",
  "#C2571A",
  "#9A2617",
  "#D3B53D",
  "#DA621E",
  "#AD2A1A",
  "#EBC944",
  "#F26D21",
  "#C02F1D",
  "#EFD469",
  "#F58B4C",
  "#CD594A",
]

export function randomColor() {
    const idx =  Math.floor(Math.random() * colors.length)
    console.log("colors", colors.length, idx, colors[idx])
    return colors[idx]
  }
  