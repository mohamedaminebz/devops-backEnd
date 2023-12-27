const roles = {
  ALL: "ALL",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  COLLABORATOR: "COLLABORATOR",
  CLIENT: "CLIENT",
};

const isAll = () => {
  return true;
};
const isADMIN = (user) => {
  return user?.role === roles.ADMIN;
};
const isCOLLABORATOR = (user) => {
  return user?.role === roles.COLLABORATOR;
};

const isCLIENT = (user) => {
  return user?.role === roles.CLIENT;
};
const isSUPERADMIN = (user) => {
  return user?.role === roles.SUPER_ADMIN;
};
module.exports = {
  roles,
  isAll,
  isADMIN,
  isCLIENT,
  isCOLLABORATOR,
  isSUPERADMIN,
};
