export default class Product{


    constructor() {
        this._id = null;
        this._name = null;
        this._code = null;
        this._category = null;
        this._description = null;
        this._needs_recipe = null;
        this._unit_price = null;
        this._on_stock = null;
        this._manager = null;
        this._image_path = null;
        this._data = null;
    }

    persistente(data){
        this._id = data.id;
        this._name = data.name;
        this._code = data.code;
        this._category = data.category;
        this._description = data.description;
        this._needs_recipe = data.needs_recipe;
        this._unit_price = data.unit_price;
        this._on_stock = data.on_stock;
        this._manager = data.manager;
        this._image_path = data.image_path;
        this._data = data;
        return this;
    }


    get data() {
        return this._data;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get code() {
        return this._code;
    }

    get category() {
        return this._category;
    }

    get description() {
        return this._description;
    }

    get needs_recipe() {
        return this._needs_recipe;
    }

    get unit_price() {
        return this._unit_price;
    }

    get on_stock() {
        return this._on_stock;
    }

    get manager() {
        return this._manager;
    }

    get image_path() {
        return this._image_path;
    }
}