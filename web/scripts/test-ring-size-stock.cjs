const fs=require('fs'),ts=require('typescript'),assert=require('assert/strict');
const root=require('path').resolve(__dirname,'..');
function load(file,mocks){const m={exports:{}};new Function('require','module','exports',ts.transpileModule(fs.readFileSync(root+'/'+file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(n=>{if(n in mocks)return mocks[n];throw Error(n)},m,m.exports);return m.exports;}
const variants=load('src/features/products/utils/productVariant.utils.ts',{});
const sizes=load('src/features/products/utils/ringSizeOptions.utils.ts',{'./productVariant.utils':variants,'@/services/magento/products/productCustomOptions.mapper':{getCustomOptionDisplayLabels:o=>o?.labels??[]}});
// Captured Magento response for SKU 2250325794922 (2026-10-09).
const raw={
  "sku": "2250325794922",
  "configurable_options": [
    {
      "attribute_code": "sd_ring_size",
      "label": "Ring Size",
      "values": [
        {
          "uid": "Y29uZmlndXJhYmxlLzE4MS85Mg==",
          "label": "2"
        },
        {
          "uid": "Y29uZmlndXJhYmxlLzE4MS85Mw==",
          "label": "3"
        },
        {
          "uid": "Y29uZmlndXJhYmxlLzE4MS85NA==",
          "label": "4"
        },
        {
          "uid": "Y29uZmlndXJhYmxlLzE4MS85NQ==",
          "label": "5"
        },
        {
          "uid": "Y29uZmlndXJhYmxlLzE4MS85Ng==",
          "label": "6"
        },
        {
          "uid": "Y29uZmlndXJhYmxlLzE4MS85Nw==",
          "label": "7"
        },
        {
          "uid": "Y29uZmlndXJhYmxlLzE4MS85OA==",
          "label": "8"
        },
        {
          "uid": "Y29uZmlndXJhYmxlLzE4MS85OQ==",
          "label": "9"
        },
        {
          "uid": "Y29uZmlndXJhYmxlLzE4MS8xMDA=",
          "label": "10"
        }
      ]
    }
  ],
  "variants": [
    {
      "attributes": [
        {
          "code": "sd_ring_size",
          "label": "2",
          "uid": "Y29uZmlndXJhYmxlLzE4MS85Mg==",
          "value_index": 92
        }
      ],
      "product": {
        "sku": "2250325794922-2",
        "stock_status": "IN_STOCK"
      }
    },
    {
      "attributes": [
        {
          "code": "sd_ring_size",
          "label": "5",
          "uid": "Y29uZmlndXJhYmxlLzE4MS85NQ==",
          "value_index": 95
        }
      ],
      "product": {
        "sku": "2250325794922-5",
        "stock_status": "IN_STOCK"
      }
    },
    {
      "attributes": [
        {
          "code": "sd_ring_size",
          "label": "3",
          "uid": "Y29uZmlndXJhYmxlLzE4MS85Mw==",
          "value_index": 93
        }
      ],
      "product": {
        "sku": "2250325794922-3",
        "stock_status": "IN_STOCK"
      }
    },
    {
      "attributes": [
        {
          "code": "sd_ring_size",
          "label": "4",
          "uid": "Y29uZmlndXJhYmxlLzE4MS85NA==",
          "value_index": 94
        }
      ],
      "product": {
        "sku": "2250325794922-4",
        "stock_status": "IN_STOCK"
      }
    },
    {
      "attributes": [
        {
          "code": "sd_ring_size",
          "label": "7",
          "uid": "Y29uZmlndXJhYmxlLzE4MS85Nw==",
          "value_index": 97
        }
      ],
      "product": {
        "sku": "2250325794922-7",
        "stock_status": "OUT_OF_STOCK"
      }
    },
    {
      "attributes": [
        {
          "code": "sd_ring_size",
          "label": "6",
          "uid": "Y29uZmlndXJhYmxlLzE4MS85Ng==",
          "value_index": 96
        }
      ],
      "product": {
        "sku": "2250325794922-6",
        "stock_status": "OUT_OF_STOCK"
      }
    },
    {
      "attributes": [
        {
          "code": "sd_ring_size",
          "label": "8",
          "uid": "Y29uZmlndXJhYmxlLzE4MS85OA==",
          "value_index": 98
        }
      ],
      "product": {
        "sku": "2250325794922-8",
        "stock_status": "OUT_OF_STOCK"
      }
    },
    {
      "attributes": [
        {
          "code": "sd_ring_size",
          "label": "9",
          "uid": "Y29uZmlndXJhYmxlLzE4MS85OQ==",
          "value_index": 99
        }
      ],
      "product": {
        "sku": "2250325794922-9",
        "stock_status": "OUT_OF_STOCK"
      }
    },
    {
      "attributes": [
        {
          "code": "sd_ring_size",
          "label": "10",
          "uid": "Y29uZmlndXJhYmxlLzE4MS8xMDA=",
          "value_index": 100
        }
      ],
      "product": {
        "sku": "2250325794922-10",
        "stock_status": "OUT_OF_STOCK"
      }
    }
  ]
};
const p={configurable:{options:raw.configurable_options.map(o=>({attributeCode:o.attribute_code,label:o.label,values:o.values})),variants:raw.variants.map(v=>({sku:v.product.sku,inStock:v.product.stock_status==='IN_STOCK',optionUids:v.attributes.map(a=>a.uid),attributes:Object.fromEntries(v.attributes.map(a=>[a.code,a.label]))}))}};
const result=sizes.getRingSizeOptions(p,{sizeLabels:['99']});
assert.deepEqual(result.map(o=>o.label),['2','3','4','5','6','7','8','9','10']);
assert.deepEqual(result.filter(o=>!o.inStock).map(o=>o.label),['6','7','8','9','10']);
for(const o of result){assert.equal(o.variant.sku,'2250325794922-'+o.label);assert.equal(Number(Buffer.from(o.variant.optionUids[0],'base64').toString().split('/').pop()),Number(o.label)+90);}
assert.deepEqual(sizes.getRingSizeLabels({customOptions:{ringSize:{labels:['11','12']}}},{sizeLabels:['99']}),['11','12']);
assert.deepEqual(sizes.getRingSizeLabels({}, {sizeLabels:['13']}),['13']);
const multi=structuredClone(p);multi.configurable.options.push({attributeCode:'sd_metal_color',values:[{label:'Rose Gold',uid:'rose'},{label:'Yellow Gold',uid:'yellow'}]});
multi.configurable.variants=multi.configurable.variants.flatMap(v=>['rose','yellow'].map(m=>({...v,attributes:{...v.attributes,sd_metal_color:m+'-gold'},optionUids:[...v.optionUids,m],inStock:m==='rose'?v.inStock:false})));
assert.equal(sizes.getRingSizeOptions(multi,null,'yellow-gold').every(o=>!o.inStock),true);
assert.equal(sizes.getRingSizeOptions(multi,null,'rose-gold').filter(o=>o.inStock).length,4);
p.configurable.variants=[];assert.equal(sizes.getRingSizeOptions(p,null).every(o=>!o.inStock),true);
console.log('PASS: captured SKU response label/code/UID/SKU mapping, unordered variants, stock, metal combinations, missing variants and custom/CMS fallback');
