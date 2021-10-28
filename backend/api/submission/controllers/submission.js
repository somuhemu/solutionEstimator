'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
	//api customization
	create: async ctx => {
		let data = ctx.request.body;
		let answers = data.answers;
		let lowerPrice = 0;
		let upperPrice = 0;
		for (var i = 0; i < answers.length; i++) {
			for (var j = 0; j < answers[i].options.length; j++) {
				// console.log(answers[i].options[j]);
				lowerPrice += answers[i].options[j].minPrice;
				upperPrice += answers[i].options[j].maxPrice;
			}
		}
		data.lowerEstimate = lowerPrice;
		data.upperEstimate = upperPrice;
		let values = await strapi.services.submission.create(data);
		console.log(values)
		return values

	}
    
};
