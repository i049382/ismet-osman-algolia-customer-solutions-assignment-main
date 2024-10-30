const algoliasearch = require('algoliasearch');
const fs = require('fs');

// get Algolia credentials
const args = process.argv.slice(2);
if (args.length !== 3) {
  console.error('Usage: node changeprice.js <appId> <apiKey> <indexName>');
  process.exit(1);
}

const [appId, apiKey, indexName] = args;

// Load products.json
const products = JSON.parse(fs.readFileSync('products.json', 'utf-8'));

// Get price ranges
const priceRanges = [...new Set(products.map(product => product.price_range))];
console.log(priceRanges)

// Price ranges are string so need to do some manipulations to get the correct price range
function findPriceRange(price, ranges) {
  if (price > 2000) return '> 2000';
  // Find correct range
  return ranges.find(range => {
    if (range === '> 2000') return false;
    const [min, max] = range.split(' - ').map(Number);
    return price >= min && price <= max;
  });
}

// Filter and update camera prices
const updatedProducts = products.map(product => {
  if (product.hierarchicalCategories && product.hierarchicalCategories.lvl0 === 'Cameras & Camcorders') {
    // Calculating the new price
    product.price = Math.floor(product.price * 0.8);

    // Update price range
    product.price_range = findPriceRange(product.price, priceRanges);
  }
  return product;
});

// Setup Algolia client
const client = algoliasearch(appId, apiKey);
const index = client.initIndex(indexName);

// Save updated products to Algolia
index
  .saveObjects(updatedProducts)
  .then(({ objectIDs }) => {
    console.log('Updated products uploaded to Algolia:', objectIDs);
  })
  .catch(err => {
    console.error('Error uploading products to Algolia:', err);
  });
