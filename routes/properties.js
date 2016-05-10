'use strict';

var express = require('express');
var router = express.Router();
var Property = require('../models/property');
console.log('@ Properties => ', JSON.stringify(Property, 2, null));


router.route('/')
.get((req, res) => {
  Property
  .find({})
  .exec(res.handle)
})
.post((req, res) => {
  Property
  .create(req.body, res.handle)
});

router.route('/:id')
.get((req, res) => {
  Property
  .findById(req.params.id)
  .populate('client')
  .exec(res.handle)
})
.delete((req, res) => {
  Property
  .findByIdAndRemove(req.params.id)
  .exec(res.handle)
})
.put((req, res) => {
  Property
  .findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true})
  .exec(res.handle)
});

router.put('/:property/populate/:client', (req, res) => {
  Property.assign(req.params.property, req.params.client, res.handle);
});

router.put('/:property/vacancy/:client', (req, res) => {
  Property.remove(req.params.property, req.params.client, res.handle);
});



module.exports = router;





// router.put('/:id', (req, res) => {
//   Property.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true}, (err, property) => {
//     if(err){
//       res.status(400).send(err);
//     } else {
//       res.send(property);
//     }
//   });
// });

// router.delete('/:id', (req, res) => {
//   Property.findByIdAndRemove(req.params.id, err => {
//     if(err){
//       res.status(400).send(err);
//     } else {
//       res.send("Deleted!");
//     }
//   });
// });

// router.post('/', (req, res) => {
//   Property.create(req.body, (err, savedProperty)=>{
//     if(err){
//       res.status(404).send(err);
//     } else {
//       res.send(savedProperty);
//     }
//   });
// });

// router.get('/', (req, res) => {
//   Property.find({}, (err, properties)=> {
//     if(err){
//       res.status(400).send(err);
//     }
//     else {
//       res.send(properties);
//     };
//   });
// });


// router.get('/:id', (req, res) => {
//   Property.findById(req.params.id, (err, property) => {
//     if(err){
//       res.status(400).send(err);
//     } else {
//       res.send(property);
//     }
//   });
// });

//
//
//
// router.get('/:category', (req, res) => {
//   console.log(req.params.category);
//   Property.find(req.params.category, (err, property) =>{
//     if(err){
//       res.status(400).send(err);
//     } else {
//       res.send(property);
//     }
//   });
// });
//
