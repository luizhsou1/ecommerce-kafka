class CurrencyUtil {
  static #defaultFormat = Intl.NumberFormat('pt-br', {
    currency: 'BRL',
    style: 'currency'
  })

  static format(value) {
    return this.#defaultFormat.format(value)
  }
}

module.exports = CurrencyUtil