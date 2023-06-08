var Odoo = require('async-odoo-xmlrpc');

exports.getProducts = async (req, res) => {
	
	console.log("GET /api/products");
		var odoo = new Odoo({
        url: 'http://104.43.252.217/',
        port: 80,
        db: 'bitnami_odoo',
        username: 'user@example.com',
        password: '850g6dHsX1TQ'
    });


    try {
        await odoo.connect();
        console.log("Connect to Odoo XML-RPC - api/products");

         let products = await odoo.execute_kw('product.template', 'search_read', [[['type', '=', 'consu']]], {'fields': [ 'name', 'public_categ_ids'], 'limit': 5})
         // [[['is_company', '=', True]]], {'fields': ['name', 'country_id', 'comment'], 'limit': 5})
         // let products = await odoo.execute_kw('product.template', 'search_read', [[['type', '=', 'consu']]]);
         // 
         // console.log(products);
         res.status(201).json({ products });
    } catch(e) {
        console.error("Error when try connect Odoo XML-RPC.", e);
    }	
}


exports.filterProducts = async (req, res) => {

   		console.log(" GET /api/product/filter");
	   	var odoo = new Odoo({
	        url: 'http://104.43.252.217/',
	        port: 80,
	        db: 'bitnami_odoo',
	        username: 'user@example.com',
	        password: '850g6dHsX1TQ'
	    });


	    const category = req.body.category_id;
	    const offset = 5;
	    const page = 0;

	    try {
		    await odoo.connect();

		    if(category  === null) {
		        let products = await odoo.execute_kw('product.product', 'search_read', [
		            [['type', '=', 'consu']]
		            , ['name','list_price', 'image_512', 'categ_id', 'rating_avg', 'rating_count', 'website_url', 'public_categ_ids', 'website_meta_keywords'] // Fields
		            , 0, 5 // Offset, Limit
		          ]);
		  
		          res.status(201).json({ products });

		    } else {
		        let products = await odoo.execute_kw('product.product', 'search_read', [
		            [['type', '=', 'consu'], ['public_categ_ids', '=',  Number(category)]]
		            , ['name','list_price', 'image_512', 'categ_id', 'rating_avg', 'rating_count', 'website_url', 'public_categ_ids', 'website_meta_keywords'] // Fields
		            , 0, 5 // Offset, Limit
		          ]);
		  
		          res.status(201).json({ products });
		    }
		   
		} catch(e) {
		    console.error("Error when try connect Odoo XML-RPC.", e);
		}

}


exports.productDetails = async ( req, res) => {

		console.log(" GET /api/details");

		var odoo = new Odoo({
	        url: 'http://104.43.252.217/',
	        port: 80,
	        db: 'bitnami_odoo',
	        username: 'user@example.com',
	        password: '850g6dHsX1TQ'
		});

       const productId = req.params.id
       
	   try {
	        await odoo.connect();
	      
	        console.log("Connect to Odoo XML-RPC is successed.");
	     
	        let id = await odoo.execute_kw('product.template', 'search', [
	            [['id', '=', productId]]]);

	        let products = await odoo.execute_kw('product.template', 'read', [id]);
	         res.status(201).json( products );
	        
	    } catch(e) {
	        console.error("Error when try connect Odoo XML-RPC.", e);
	    }
}


exports.wishlistProduct = async ( req, res) => {

		console.log(" GET /api/details");

		var odoo = new Odoo({
	        url: 'http://104.43.252.217/',
	        port: 80,
	        db: 'bitnami_odoo',
	        username: 'user@example.com',
	        password: '850g6dHsX1TQ'
		});

       const productId = req.params.id
       
	   try {
	        await odoo.connect();
	      
	        console.log("Connect to Odoo XML-RPC is successed.");
	     
	        let id = await odoo.execute_kw('product.template', 'search', [
	            [['id', '=', productId]]]);

	        let products = await odoo.execute_kw('product.wishlist', 'read', [id]);
	         res.status(201).json( products );
	        
	    } catch(e) {
	        console.error("Error when try connect Odoo XML-RPC.", e);
	    }
}

// exports.createProducts = async (req, res) => {

// 	var odoo = new Odoo({
//         url: 'http://104.43.252.217/',
//         port: 80,
//         db: 'bitnami_odoo',
//         username: 'user@example.com',
//         password: '850g6dHsX1TQ'
//     });


// 	try {
// 		await odoo.execute_kw('product.template', 'search', [
//             [['id', '=', productId]]]);

// 		models.execute_kw(db, uid, password, 'res.partner', 'create', [{'name': "New Partner"}])
// 	}
// }
