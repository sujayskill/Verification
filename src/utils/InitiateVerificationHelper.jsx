export const canInitiateVerification = (status) => {
  return ["CREATED", "ROLLED_BACK"].includes(status);
};

export const isVerificationLocked = (status) => {
  return ["INITIATED", "IN_PROGRESS"].includes(status);
};