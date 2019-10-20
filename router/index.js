const express = require('express')
const Crawler = require("crawler");
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/mydb', { useNewUrlParser: true }).then(() => {
    console.log('ok')
}).catch((error) => {
    console.log('error')
});

const { Product } = require('../model/product')

const router = express.Router()

router.all('/fetch/:asin', (req, res) => {
    const { asin } = req.params
    let url = "https://www.amazon.com/dp/" + asin

    const c = new Crawler({
        maxConnections: 10,
        callback: async function (error, r, done) {
            if (error) {
                console.log(error);
                return res.json({ code: -1, msg: error })
            } else {
                var $ = r.$;
                const category = []
                const rank = []
                let productDimensions = ''
                let title = $("#productTitle").text().trim()

                $('#wayfinding-breadcrumbs_feature_div ul .a-link-normal.a-color-tertiary').each(function () {
                    category.push($(this).text().trim())
                })

                const pattern = /[0-9]+/
                rank.push({
                    rank: $('#SalesRank').clone().children().remove('style,ul,a').end().text().trim().match(pattern)[0],
                    ladder: $('#SalesRank a').first().text().trim()
                })
                $('#SalesRank .value .zg_hrsr_item').each(function () {
                    rank.push({
                        rank: $(this).find('.zg_hrsr_rank').text().trim().match(pattern)[0],
                        ladder: $(this).find('.zg_hrsr_ladder').text().trim()
                    })
                })

                $('#prodDetails .column.col1 tr').each(function () {
                    if ($(this).find('td').first().text().trim() == 'Product Dimensions') {
                        productDimensions = $(this).find('td').last().text().trim()
                    }
                })

                $('#detail-bullets table tr .content li').each(function () {
                    if ($(this).text().trim().indexOf('Product Dimensions') > -1) {
                        $(this).clone().remove('b').end().text().trim().match(pattern)[0],
                        productDimensions = $(this).text().trim()
                    }
                })


                const insetDoc = { asin, title, category, rank, productDimensions }

                await Product.findOneAndUpdate({ asin }, insetDoc, { upsert: true, rawResult: true, new: true });
                // Product.create(insetDoc);

                res.json({ code: 200, msg: 'ok', ...insetDoc })
            }
            done();
        }
    });

    c.queue(url);
})

exports.router = router