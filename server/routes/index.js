const router = require('koa-router')()
const fs = require('fs')
const menu = require('../models/menu.json')
const logicData = require('../models/logicData.json')
const users = require('../models/users.json')
const abilityDeploy = require('../models/abilityDeploy.json')
const abilityDeployRangeList = require('../models/abilityDeployRangeList.json')
const getLogicGroup = require('../models/getLogicGroup.json')
const getApps = require('../models/getApps.json')
const getDependConfig = require('../models/getDependConfig.json')
const getCustomersList = require('../models/getCustomersList.json')

let prefix = '/ec';

router.get('/', function (ctx, next) {
  ctx.type = 'html';
  ctx.body = fs.createReadStream('public/index.html');
})

router.get(prefix + '/logicData', function (ctx, next) {
  ctx.body = logicData
})

router.get(prefix + '/abilityDeploy', function (ctx, next) {
  ctx.body = abilityDeploy
})

router.get(prefix + '/abilityDeployRangeList', function (ctx, next) {
  ctx.body = abilityDeployRangeList
})

router.get(prefix + '/abilityDeploySoftware/getLogicGroup', function (ctx, next) {
  ctx.body = getLogicGroup
})

router.post(prefix + '/applicationDeploy/getDependConfig', function (ctx, next) {
  ctx.body = getDependConfig
})

router.post(prefix + '/applicationDeploy/editApp', function (ctx, next) {
  ctx.body = getDependConfig
})

router.get(prefix + '/getApps', function (ctx, next) {
  ctx.body = getApps
})

router.get(prefix + '/users', function (ctx, next) {
  ctx.body = users
})

router.post(prefix + '/getCustomersList', function (ctx, next) {
  ctx.body = getCustomersList
})

router.post(prefix + '/customersSelect', function (ctx, next) {
  ctx.body = getCustomersList
})

router.get(prefix + '/meta', function (ctx, next) {
  ctx.body = menu
})

module.exports = router
