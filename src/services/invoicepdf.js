const PdfPrinter = require('pdfmake');
const order = require('../model/order.model')
const user = require('../model/userauthmodel')
const product = require('../model/products.model')

var fs = require('fs')

const makepdf = async (id) => {

    const orderdata = await order.findById(id)
    console.log(orderdata)

    const productdata = await product.find();

    const productRows = orderdata?.products.map((item, index) => {

        const prod = productdata.find(
            (p) => p._id.toString() === item.product_id.toString()
        );

        return [
            index + 1,
            prod ? prod.name : "Unknown Product",
            item.price,
            item.quantity,
            item.price * item.quantity
        ];
    });
    const totalAmount = orderdata?.products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const users = await user.findById(orderdata.user_id)

    let invoiceNumber = orderdata.invoiceno;

    if (!invoiceNumber) {
        invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        orderdata.invoiceno = invoiceNumber;
        await orderdata.save();
    }

    orderdata.invoiceno = invoiceNumber;
    await orderdata.save();

    const fonts = {
        Roboto: {
            normal: './public/fonts/Roboto-Regular.ttf',
            bold: './public/fonts/Roboto-Medium.ttf',
            italics: './public/fonts/Roboto-Italic.ttf',
            bolditalics: './public/fonts/Roboto-MediumItalic.ttf'
        }
    }

    //pdfmake.addFonts(fonts);

    var printer = new PdfPrinter(fonts)

    const docDefinition = {
        content: [
            { text: 'Exclusive', fontSize: 25, bold: true, alignment: 'right' },
            {
                columns: [
                    {
                        stack: [
                            { text: 'Billed To :', bold: true },
                            { text: users.name },
                            { text: orderdata.address.streetaddress },
                            { text: orderdata.address.streetaddre ? orderdata.address.streetaddre : '' },
                            { text: 'Mansarovar Jaipur - 302020' },
                            { text: orderdata.address.city + " " + orderdata.address.state + " " + orderdata.address.pincode },
                            { text: 'IN' }
                        ],
                    },
                    {
                        stack: [
                            {
                                text: [
                                    { text: 'Invoice No:' },
                                    { text: invoiceNumber }
                                ], alignment: 'right'
                            },
                            { text: '18 march 2026', alignment: 'right' },

                        ],
                    }
                ],
                margin: [0, 30, 0, 40]
            },
            // {
            //     style: 'tableExample',
            //     table: {
            //         body: [
            //             [
            //                 { text: 'SI.NO', fillColor: '#555758',color:'white' },
            //                 { text: 'Description', fillColor: '#555758',color:'white' },
            //                 { text: 'UNIT PRICE', fillColor: '#555758',color:'white' },
            //                 { text: 'Qty', fillColor: '#555758',color:'white' },
            //                 { text: 'Total AMOUNT', fillColor: '#555758',color:'white' }
            //             ],
            //             [
            //                 { text: '1', rowSpan: 2 },
            //                 {
            //                     text: 'demo',
            //                     border: [true, true, true, false]
            //                 },
            //                 { text: "₹117.80", border: [true, true, true, false] },
            //                 { text: "2", border: [true, true, true, false] },
            //                 { text: "₹278.00", border: [true, true, true, false] },
            //             ],
            //             [
            //                 {}, // ✅ REQUIRED (empty because of rowSpan)
            //                 { text: '' ,border: [true, true, true, false]},
            //                 { text: "" ,border: [true, true, true, false]},
            //                 { text: "",border: [true, true, true, false] },
            //                 { text: "",border: [true, true, true, false] },
            //             ]

            //             // [
            //             //     { text: 'TOTAL:', colSpan: 7, alignment: 'left' },
            //             //     '', '', '', '', '', '',
            //             //     { text: '₹54.60', fillColor: '#808080' },
            //             //     { text: '₹358.00', fillColor: '#808080' }
            //             // ],
            //         ]
            //     }, margin: [0, 20, 0, 0]
            // },
            {
                style: 'tableExample',
                table: {
                    widths: [40, '*', 80, 80, 80],
                    body: [
                        // Header
                        [
                            { text: '#', fillColor: '#4a4a4a', color: 'white', bold: true },
                            { text: 'ProDuct', fillColor: '#4a4a4a', color: 'white', bold: true },
                            { text: 'PRICE', fillColor: '#4a4a4a', color: 'white', bold: true },
                            { text: 'QUANTITY', fillColor: '#4a4a4a', color: 'white', bold: true },
                            { text: 'AMOUNT', fillColor: '#4a4a4a', color: 'white', bold: true },
                        ],

                        // Rows
                        // ['01', 'Logo Design', '$ 90', '1', '$ 90'],
                        // ['02', 'Business Invoice Design', '$ 30', '2', '$ 60'],
                        // ['03', 'Theme Development', '$ 99', '1', '$ 99'],
                        // ['04', 'Business Card Design', '$ 30', '4', '$ 120'],
                        // ['05', 'Infographic Presentation', '$ 60', '3', '$ 180'],
                        // ['06', 'Consultation Design', '$ 10', '7', '$ 70'],
                        ...productRows,
                        [
                            { text: '', border: [false, false, false, false], fillColor: 'white' },
                            { text: '', border: [false, false, false, false], fillColor: 'white' },

                            { text: 'TOTAL', colSpan: 2, alignment: 'left', fillColor: '#4a4a4a', color: 'white' },
                            '',
                            { text: totalAmount, fillColor: '#4a4a4a', color: 'white' },
                        ],
                        // [
                        //     {

                        //     }
                        //     {
                        //         text: 'TOTAL: ',
                        //         colSpan: 4,
                        //         bold: true,
                        //         fillColor: '#4a4a4a',
                        //         color: 'white',
                        //         margin: [0, 8]
                        //     },
                        //     { text: '1200', bold: true,color:'white' },

                        // ]
                    ]
                },
                layout: {
                    fillColor: function (rowIndex) {
                        return rowIndex % 2 === 0 ? null : '#f5f5f5'; // alternate rows
                    },
                    paddingTop: function (rowIndex, node) {
                        return 8; // top padding
                    },
                    paddingBottom: function (rowIndex, node) {
                        return 8; // bottom padding
                    }
                }

            },


        ],
    }

    var pdfDoc = printer.createPdfKitDocument(docDefinition)
    // pdfDoc.pipe(fs.createWriteStream('invoicePDF.pdf'))
    // pdfDoc.end()

    return pdfDoc
}

module.exports = makepdf;