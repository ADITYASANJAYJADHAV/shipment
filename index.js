/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/* global jpdbBaseURL */

var jpdbBaseURl = "http://api.login2explore.com:5527";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var shipDBName = "ship-DB";
var shipRelationName = "ShipData";
var connToken = "90931862|-31949301413391630|90963077";

$("#shipid").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.stringify(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getShipIdAsJsonObj() {
    var shipid = $("#shipid").val();
    var jsonStr = {
        id: shipid
    };
     return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#shipid").val(record.no);
    $("#desc").val(record.desc);
    $("#src").val(record.src);
    $("#dest").val(record.dest);
    $("#shipda").val(record.shipda);
    $("#dil").val(record.dil);
}

function resetForm() {
    $("#shipid").val("");
    $("#desc").val("");
    $("#src").val("");
    $("#dest").val("");
    $("#shipda").val("");
    $("#dil").val("");
    $("#shipid").prop("disabled", false);
    $("#desc").prop("disabled", true);
    $("#src").prop("disabled", true);
    $("#dest").prop("disabled", true);
    $("#shipda").prop("disabled", true);
    $("#dil").prop("disabled", true);
    $("#shipid").focus();
}

function validateData() {
    var shipid, desc, src, dest, shipda, dil;
    shipid = $("#shipid").val();
    desc = $("#desc").val();
    src = $("#src").val();
    dest = $("#dest").val();
    shipda = $("#shipda").val();
    dil = $("#dil").val();
    if (shipid === "") {
        alert("Shipping ID missing");
        $("#shipid").focus();
        return "";
    }
    if (desc === "") {
        alert("Discription missing");
        $("#desc").focus();
        return "";
    }
    if (src === "") {
        alert("Source missing");
        $("#src").focus();
        return "";
    }
    if (dest === "") {
        alert("Destination missing");
        $("#dest").focus();
        return "";
    }
    if (shipda === "") {
        alert("Shipping Date missing");
        $("#shipda").focus();
        return "";
    }
    if (dil === "") {
        alert("Dilivery Date missing");
        $("#dil").focus();
        return "";
    }

    var jsonStrObj = {
        Shipment: shipid,
        Discription: desc,
        Source: src,
        Destination: dest,
        Shipping: shipda,
        Dilivery: dil
    };
    return JSON.stringify(jsonStrObj);
}

function getShip() {
    var shipIdjsonObj = getEmpIdAsjsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, shipDBName, shipRelationName, shipIdjsonObj);
    jQuery.ajaxSetup({async: false});
    var resjsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    if (resjsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#desc").focus();
    } else if (resjsonObj.status === 200) {

        $("#shipid").prop("disabled", false);
        fillData(resjsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#desc").focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }
    var putRequest = createUPDATERecordRequest(connToken, jsonStrObj, shipDBName, shipRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#shipid").focus();
}


function changeData() {
    $("#change").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, shipDBName, shipRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#shipid").focus();
}


