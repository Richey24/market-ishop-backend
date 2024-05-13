const {
     ServiceFirstCat,
     ServiceSecondCat,
     ServiceThirdCat,
} = require("../../model/ServiceCategory");

const addFirstCat = async (req, res) => {
     try {
          const result = await ServiceFirstCat.create(req.body);
          res.status(201).json(result);
     } catch (error) {
          res.status(500).json({ error, status: false });
     }
};
const addSecondCat = async (req, res) => {
     try {
          const result = await ServiceSecondCat.create(req.body);
          res.status(201).json(result);
     } catch (error) {
          res.status(500).json({ error, status: false });
     }
};
const addThirdCat = async (req, res) => {
     try {
          const result = await ServiceThirdCat.create(req.body);
          res.status(201).json(result);
     } catch (error) {
          res.status(500).json({ error, status: false });
     }
};

const getCat = async (req, res) => {
     try {
          const imgArr = [
               "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/GraphicDesign.png",
               "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/ProgrammingTech.png",
               "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/DigitalMarket.png",
               "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/videoadnanimation.png",
               "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/WritingTranslation.png",
               "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/MusicAudio.png",
               "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/Business.png",
               "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/Data.png",
               "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/Photography.png",
               "https://cdn.jsdelivr.net/gh/Richey24/imarket-cdn/src/assets/images/categories/AI%20Service.png",
          ];

          const firstCats = await ServiceFirstCat.find({});
          const secondCats = await ServiceSecondCat.find({});
          const thirdCats = await ServiceThirdCat.find({}).select("name secondCat");

          const categories = firstCats.map((firstCat, index) => {
               const firstSub = secondCats
                    .filter((secCat) => secCat.firstCat === firstCat.name)
                    .map((secCat) => {
                         const subCat = thirdCats
                              .filter((thirdCat) => thirdCat.secondCat === secCat.name)
                              .map((thirdCat) => ({ name: thirdCat.name, id: thirdCat?._id }));

                         return { id: secCat._id, name: secCat.name, subCat };
                    });

               return {
                    id: firstCat?._id,
                    name: firstCat.name,
                    image: imgArr[index],
                    firstSub,
               };
          });

          res.status(201).json(categories);
     } catch (error) {
          res.status(500).json({ error, status: false });
     }
};

const getMainCategory = async (req, res) => {
     try {
          const result = await ServiceFirstCat.find({});
          res.status(201).json(result);
     } catch (error) {
          res.status(500).json({ error, status: false });
     }
};

const getFirstSubCategory = async (req, res) => {
     try {
          const { sub } = req.body;
          const result = await ServiceSecondCat.find({ firstCat: sub });
          res.status(201).json(result);
     } catch (error) {
          res.status(500).json({ error, status: false });
     }
};

const getSecondSubCategory = async (req, res) => {
     try {
          const { sub } = req.body;
          const result = await ServiceThirdCat.find({ secondCat: sub });
          res.status(201).json(result);
     } catch (error) {
          res.status(500).json({ error, status: false });
     }
};

module.exports = {
     addFirstCat,
     addSecondCat,
     addThirdCat,
     getCat,
     getMainCategory,
     getFirstSubCategory,
     getSecondSubCategory,
};
