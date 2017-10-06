var { Promotion, Settlement } = require('../models')
var { Response, ApiError } = require('../models/Response')

function deletePromotion(req, res){
  var params = req.params
  Promotion.destroy({ where: params })
  .then(rowsDeleted => {
    var response = Response.createOkResponse("Successful deleted", {deleted: rowsDeleted})
    res.status(201).send(response)
  })
  .catch(err => {
    var response = Response.createServerErrorResponse()
    res.status(501).send(response)
  })
}

function postPromotion(req, res){

  if(req.files){
    var imageName = 'promotion-' + shortid.generate() + '.jpg'
    req.body.image = imageName
  }

  Promotion.create(req.body)
  .then( promotion => {
    if(req.files){
      fileManager.save(req.files.image,
                       req.body.image,
                       path.join(__dirname, "../public/images/promotions"))
      .then(_ => {
        var response = Response.createOkResponse("Successful promotion creation", {promotion: promotion})
        res.status(201).send(response)
      })
      .catch(err => {
        console.log(err);
        var response = Response.createServerErrorResponse()
        res.status(501).send(response)
      })
    }else{
      var response = Response.createOkResponse("Successful promotion creation", {settlement: settlement})
      res.status(201).send(response)
    }
  })
  .catch( err => {
    console.log(err);
    var response = Response.createErrorResponse("Validation failed", err)
    res.status(422).send(response)
  })
}

module.exports = {
  deletePromotion,
  postPromotion
}
