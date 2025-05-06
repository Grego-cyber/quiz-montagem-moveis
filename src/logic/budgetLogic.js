export function calculateNewFurnitureBudget(furnitureValue, hasMirror) {
  let assemblyCost = 0;

  if (furnitureValue <= 600) {
    assemblyCost = 60;
  } else if (furnitureValue >= 601 && furnitureValue <= 1000) {
    assemblyCost = furnitureValue * 0.10;
  } else if (furnitureValue > 1000) {
    assemblyCost = furnitureValue * 0.13;
  }

  if (hasMirror) {
    assemblyCost += assemblyCost * 0.20;
  }

  return assemblyCost;
}

export function calculateUsedFurnitureBudget(size, needsDisassembly, isKitchenOrByPiece, numberOfPieces = 0) {
  let baseCost = 0;

  if (isKitchenOrByPiece) {
    baseCost = numberOfPieces * 40;
  } else {
    switch (size) {
      case "pequeno":
        baseCost = 80;
        break;
      case "medio":
        baseCost = 100;
        break;
      case "grande":
        baseCost = 150;
        break;
      default:
        baseCost = 0; 
        break;
    }
  }

  if (needsDisassembly) {
    baseCost += baseCost * 0.30;
  }

  return baseCost;
}
