'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    create : async ctx =>{
		console.log(ctx.request.body);
		var data=ctx.request.body;
		var questions=data.answers;
		var lowerEstimate=0;
		var upperEstimate=0;
		for(var i=0;i<questions.length;i++){
			for(var j=0;j<questions[i].options.length;j++){
console.log(questions[i].options[j]);
				lowerEstimate+=questions[i].options[j].minPrice;
				upperEstimate+=questions[i].options[j].maxPrice;
			}
		}
		data.lowerEstimate=lowerEstimate;
		data.upperEstimate=upperEstimate;
		console.log(data);
		var entity = await strapi.services.submission.create(data);
		return entity

	}
    
};
