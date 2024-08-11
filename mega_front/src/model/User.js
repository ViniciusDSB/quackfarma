export default class User {
    constructor() {
        this._login = false
        this._address =null
        this._name = null
        this._cpf = null
        this._rg = null
        this._phone_number = null
        this._is_adm = null
        this._sale_id= null
        this._id= null
    }


    persistir(user){
        this._login = true
        this._address = user.address
        this._name = user.name
        this._cpf = user.cpf
        this._rg = user.rg
        this._phone_number = user.phone_number
        this._is_adm = user.is_adm
        this._id = user.id
        this._sale_id = user.sale_id
        localStorage.setItem('login',this._login)
        localStorage.setItem('address',this._address)
        localStorage.setItem('name',this._name)
        localStorage.setItem('cpf',this._cpf)
        localStorage.setItem('rg',this._rg)
        localStorage.setItem('is_adm',this._is_adm)
        localStorage.setItem('phone_number',this._phone_number)
        localStorage.setItem('sale_id',this._sale_id)
        localStorage.setItem('id',this._id)
    }


    get login() {
        return localStorage.getItem('login')
    }

    get address() {
        return localStorage.getItem('address')
    }

    get name() {
        return   localStorage.getItem('name')
    }

    get cpf() {
        return localStorage.getItem('cpf')
    }

    get rg() {
        return localStorage.getItem('rg')
    }

    get phone_number() {
        return localStorage.getItem('phone_number')
    }

    get is_adm() {
        return localStorage.getItem('is_adm')
    }

    get firstName(){
        return this.name.split(' ')[0]
    }

    get sale_id(){
        let sale =  localStorage.getItem('sale_id')
        if(sale === 'null'){
            return null
        }
        return sale
    }

    set sale_id(id){
        localStorage.setItem('sale_id',id)
    }

    get id(){
        return localStorage.getItem('id')
    }

}