const { app } = require('@azure/functions');

app.http('MNFCalc', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        //Abfrage der Parameter
        let paramA = request.query.get("paramA");
        let paramB = request.query.get("paramB");
        let paramC = request.query.get("paramC");
        
        if (request.body && [...request.query.keys()].length === 0 && (paramA === null || paramB === null || paramC === null)) {
          const params = await new Response(request.body).json();
        
          if (!paramA) paramA = params.paramA;
          if (!paramB) paramB = params.paramB;
          if (!paramC) paramC = params.paramC;
        }

        context.log(`f(x) = ` + paramA + `x^2 + ` + paramB + `x + ` + paramC);

        //Alle Parameter müssen gegeben sein, um Error zu vermeiden
        if(paramA == undefined || paramB == undefined || paramC == undefined)
            return { body: "Bitte geben Sie allen Parametern einen gültigen Wert"};

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
            return { body: "Die Nullstelle ist: X1/2: " + x1};

        return { body: "Die Nullstellen sind: X1 = " + x1 + ", X2 =  " + x2};
    }
});