export function calculateWidowIddah(startDate) {
  const end = new Date(startDate);
  end.setMonth(end.getMonth() + 4);
  end.setDate(end.getDate() + 10);
  return end;
}

export function calculateDivorceIddah(startDate) {
  const end = new Date(startDate);
  end.setDate(end.getDate() + 90);
  return end;
}
