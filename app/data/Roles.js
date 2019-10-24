 const ROLES = {
    OWNER: 1,
    ADMIN: 2,
    USER: 3
}

getRoleById = (id) => {
    return Object.keys(ROLES).find(key => ROLES[key] === id);
}

module.exports = {getRoleById}