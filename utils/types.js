/* eslint-disable */ /* eslint-disable prettier/prettier */
export function getDecimal(price) {
    const dc = Number.parseFloat(price);
    return dc.toFixed('2');
};

export function multiply(amount, price) {
    const int = Number.parseInt(amount);
    const dc = Number.parseFloat(price);
    return int * dc;
};

export async function findPriceWhere (amount, type) {
  const qs = require('qs');
  const _amount = Number.parseInt(amount);
  const _type = String.parse(type);
  const query = qs.stringify({
    _where: [{min_lte: _amount}, {max_gte: _amount}],
    sort: {type_eq: `${_type}`}
  });
  const products = await this.$strapi.find('products');
  const product = products[0];
  const name = String.parse(product.name);
  const _types = String.parse(product.type);
};