export const checkAuthorization = () => {
    const e_o = localStorage.getItem('u_t');
    console.log("tokeeennnnn - ", e_o);
    if (e_o) {
        return true;
    }
    return false;
}
