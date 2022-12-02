class Admin{
    static isAdmin = false;

    handleAdminStatus(){
        this.isAdmin = !this.isAdmin
        return this.isAdmin
    }
}

export {Admin};
