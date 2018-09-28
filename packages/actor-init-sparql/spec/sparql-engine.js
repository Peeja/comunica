const newEngine = require('@comunica/actor-init-sparql-rdfjs').newEngine;
const SparqlTest = require('sparql-test');
const N3Store = require('n3').Store;

const engine = newEngine();
module.exports = {
  parse: function (query) {
    return engine.mediatorSparqlParse.mediate({ query: query });
  },
  query: async function(data, queryString) {
    const result = await engine.query(queryString, { sources: [ { type: 'rdfjsSource', value: source(data) } ] });
    if (result.type === 'boolean') {
      return new SparqlTest.QueryResultBoolean(await result.booleanResult);
    }
    if (result.type === 'quads') {
      return new SparqlTest.QueryResultQuads(await require('arrayify-stream')(result.quadStream));
    }
    if (result.type === 'bindings') {
      return new SparqlTest.QueryResultBindings(result.variables, await require('arrayify-stream')(result.bindingsStream.map((binding) => binding.toObject())));
    }
  },
};

function source(data) {
  const store = new N3Store();
  store.addQuads(data);
  return {
    match: function(s, p, o, g) {
      return require('streamify-array')(store.getQuads(s, p, o, g));
    }
  };
}
