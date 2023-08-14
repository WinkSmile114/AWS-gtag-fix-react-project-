export const getLoanIdToDisplay = (repaymentUuid: string): string => {
  // const NUMBER_OF_CHARACTERS_OF_UUID_TO_SHOW = 10;
  const NUMBER_OF_CHARACTERS_OF_UUID_TO_SHOW = 5;
  return repaymentUuid.slice(
    repaymentUuid.length - NUMBER_OF_CHARACTERS_OF_UUID_TO_SHOW,
  );
};

export const getLoanIdToDisplayLedgerDetail = (
  repaymentUuid: string,
): string => {
  const NUMBER_OF_CHARACTERS_OF_UUID_TO_SHOW = 5;
  const p = repaymentUuid.slice(
    repaymentUuid.length - 2 - NUMBER_OF_CHARACTERS_OF_UUID_TO_SHOW,
  );
  const id = p.toString().replace('}', '');
  return id.toString().replace('"', '');
};

export const getLoanIdLedgerDetail = (
  repaymentUuid: string,
): string => {
  const r = repaymentUuid.slice(7);
  const id = r.toString().replace('}', '');
  return id.toString().replace('"', '');
};
