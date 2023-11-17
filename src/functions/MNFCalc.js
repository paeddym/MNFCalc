const { app } = require('@azure/functions');

app.http('MNFCalc', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        //Abfrage der Parameter
        const paramA = request.query.get('paramA') || await request.text() || 'world';
        const paramB = request.query.get('paramB') || await request.text() || 'world';
        const paramC = request.query.get('paramC') || await request.text() || 'world';

        context.log(`f(x) = ` + paramA + `x^2 + ` + paramB + `x + ` + paramC);

        //Buchstaben herausfiltern
        if(isNaN(paramA) || isNaN(paramB) || isNaN(paramC)) 
            return { body: "Bitte nur ganze Zahlen oder Kommazahlen mit . getrennt als Parameter übergeben"};

        //Falls die Gleichung keine quadratische Gleichung ist
        if(paramA == 0)
            return { body: "Die eingegebene Gleichung ist keine quadratische Gleichung"};

        //Rechnung
        const x1 = ((-paramB + Math.sqrt(Math.pow(paramB, 2) - (4 * paramA * paramC))) / (2 * paramA));
        const x2 = ((-paramB - Math.sqrt(Math.pow(paramB, 2) - (4 * paramA * paramC))) / (2 * paramA));
        	
        //Falls es keine NS gibt
        if(isNaN(x1) || isNaN(x2))
            return { body: "Die eingegebene quadratische Gleichung hat keine Nullstellen"};
        
        //Falls es nur eine NS gibt
        if(x1 == x2)
            return { body: "Die Nullstelle ist:\tX1/2: " + x1};

        return { body: "Die Nullstellen sind:\tX1 = " + x1 + ",\tX2 =  " + x2};
    }
});