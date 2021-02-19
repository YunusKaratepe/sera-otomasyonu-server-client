module.exports = class MyDate {
    constructor(date) {
       
        this.date_string = date.getFullYear()
        if (date.getMonth() + 1 >= 10)
            this.date_string += '.' + (date.getMonth() + 1)
        else
            this.date_string += '.0' + (date.getMonth() + 1)
        if (date.getDate() >= 10)
            this.date_string += '.' + date.getDate()
        else
            this.date_string += '.0' + date.getDate()
        if (date.getHours() >= 10)
            this.date_string += '.' + date.getHours()
        else
            this.date_string += '.0' + date.getHours()
        if (date.getMinutes() >= 10)
            this.date_string += '.' + date.getMinutes()
        else
            this.date_string += '.0' + date.getMinutes()
        if (date.getSeconds() >= 10)
            this.date_string += '.' + date.getSeconds()
        else
            this.date_string += '.0' + date.getSeconds()
    }

    toString(){
        console.log(this.date_string);
        return this.date_string
    }
}


