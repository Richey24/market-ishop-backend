const Service = require("../../model/Service");
const { BlobServiceClient } = require("@azure/storage-blob")
const fs = require("fs");
const User = require("../../model/User");
const Rating = require("../../model/Rating");
const blobClient = BlobServiceClient.fromConnectionString("DefaultEndpointsProtocol=https;AccountName=absa7kzimnaf;AccountKey=8sH4dhZjJa8cMyunmS1iDmwve5hZKLo5kaA1M9ubZScLCJ2oEsuSvWT46P2t+ouKoCwFENosnC4m+AStWRQ+rQ==;EndpointSuffix=core.windows.net")
const containerClient = blobClient.getContainerClient("newcontainer")

exports.createService = async (req, res) => {
    try {
        const body = req.body;
        const file = req.file;
        if (!body.userId) {
            return res
                .status(400)
                .json({ message: "Send userId", status: false });
        }
        if (file) {
            const imageClient = containerClient.getBlockBlobClient(file.filename)
            const response = await imageClient.uploadFile(file.path, {
                blobHTTPHeaders: {
                    blobContentType: file.mimetype,
                },
            })
            // delete image from folder after it is uploaded
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.log(err);
                }
            })
            if (response._response.status !== 201) {
                console.log("error");
                return res.status(400).json({ message: "An error occured uploading the image" })
            }

            body.image = `https://absa7kzimnaf.blob.core.windows.net/newcontainer/${file.filename}`
        }
        const result = await Service.create(req.body)

        res.status(201).json({ result, status: true });
    } catch (err) {
        res.status(500).json({ err, status: false });
    }
}

exports.updateService = async (req, res) => {
    try {
        const id = req.params.id
        const body = req.body;
        const file = req.file;
        if (!id) {
            return res
                .status(400)
                .json({ message: "Send service id", status: false });
        }
        if (file) {
            const imageClient = containerClient.getBlockBlobClient(file.filename)
            const response = await imageClient.uploadFile(file.path, {
                blobHTTPHeaders: {
                    blobContentType: file.mimetype,
                },
            })
            // delete image from folder after it is uploaded
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.log(err);
                }
            })
            if (response._response.status !== 201) {
                console.log("error");
                return res.status(400).json({ message: "An error occured uploading the image" })
            }

            body.image = `https://absa7kzimnaf.blob.core.windows.net/newcontainer/${file.filename}`
        }
        const result = await Service.findByIdAndUpdate(id, req.body, { new: true })
        res.status(201).json({ result, status: true });
    } catch (err) {
        res.status(500).json({ err, status: false });

    }
}

exports.getAllService = async (req, res) => {
    try {
        const result = await Service.find({})
        res.status(200).json({ result, status: true });
    } catch (err) {
        res.status(500).json({ err, status: false });
    }
}

exports.getOneService = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res
                .status(400)
                .json({ message: "Send service id", status: false });
        }
        const result = await Service.findById(id)
        res.status(200).json({ result, status: true });
    } catch (err) {
        res.status(500).json({ err, status: false });
    }
}

exports.getServiceByUserId = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res
                .status(400)
                .json({ message: "Send user id", status: false });
        }
        const result = await Service.find({ userId: id })
        res.status(200).json({ result, status: true });
    } catch (err) {
        res.status(500).json({ err, status: false });
    }
}

exports.searchService = async (req, res) => {
    try {
        const body = req.body
        const keys = Object.keys(body)
        const obj = {}
        keys.forEach((key) => {
            obj[key] = { "$regex": body[key], "$options": "i" }
        })
        const result = await Service.find(obj)
        res.status(200).json({ result, status: true });
    } catch (err) {
        res.status(500).json({ err, status: false });
    }
}

exports.deleteService = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res
                .status(400)
                .json({ message: "Send service id", status: false });
        }
        await Service.findByIdAndDelete(id)
        res.status(200).json({ deleted: true });
    } catch (err) {
        res.status(500).json({ err, status: false });
    }
}

exports.rateService = async (req, res) => {
    try {
        const { serviceId, userId, title, name, detail, rating } = req.body;
        if (!serviceId || !title || !userId || !name || !rating) {
            return res
                .status(400)
                .json({ message: "Send all required parameters", status: false });
        }
        const user = await User.findById(userId);
        if (user.rated.includes(serviceId)) {
            return res
                .status(400)
                .json({ message: "User already rated this service", status: false });
        }
        const rateObj = {
            productId: serviceId,
            ratings: {
                title: title,
                name: name,
                detail: detail,
                rating: rating,
                date: Date.now(),
            },
        };
        const rate = await Rating.findOne({ productId: serviceId });
        let theRate;
        if (rate) {
            theRate = await Rating.findOneAndUpdate(
                { productId: productId },
                { $push: { ratings: rateObj.ratings } },
                { new: true },
            );
        } else {
            theRate = await Rating.create(rateObj);
        }
        const mapNum = theRate.ratings.map((ra) => ra.rating);
        const ratingAvg = mapNum.reduce((a, b) => Number(a) + Number(b)) / mapNum.length;
        const result = await Service.findByIdAndUpdate(id, { rating: ratingAvg }, { new: true })
        res.status(200).json({ result, status: true });

    } catch (err) {
        res.status(500).json({ err, status: false });
    }
}