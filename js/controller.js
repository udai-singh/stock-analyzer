
var app = angular.module("app", ['ui.bootstrap']);

app.filter('offset', function() {
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
});

// // // code to not allow duplicate row stars
//   app.filter('unique', function() {
//    return function(collection, keyname) {
//     console.log("collection is " + collection);
//     console.log("keyname is " + keyname);


//       var output = [],
//           keys = [];

//       angular.forEach(collection, function(item) {

//           var key = item[keyname];
//           if(keys.indexOf(key) === -1) {
//               keys.push(key);
//               output.push(item);

//           }
//       });
//       return output;
//    };
//    alert("1");
//   });
//   // code to not allow duplicate row ends

app.controller('table_controller', ['$scope', '$http', function($scope, $http) {

// pagination code starts here
$scope.itemsPerPage = 5;
$scope.currentPage = 0;
// pagination code ends here

$scope.selected = undefined;
$scope.result = [];
$scope.oneAtATime = false;

$scope.status = {
    isFirstOpen: true,
    isSecondOpen: false,
    isFirstDisabled: false
  };

var x = -1;  // variable for remove button

var percent_change = [];  // variable to get the percent change

$http.get('js/json/tickers.json').success(function(data){

    $scope.tickr_names = [];

    angular.forEach(data, function(value, key) {

      $scope.tickr_names.push(value.tickr_name);
      // console.log($scope.tickr_names);
      // console.log(key + " " + value.tickr_name);
    });
  });



$scope.submit = function() {

  //  alert("we're in the submit method");
    var input = true;
    var the_string = $scope.selected;
    $scope.selected = '';

    if(the_string == null) {
      noInputStringAlert();
      input = false;
    }

    if(input == true){
   //   alert("1...");
    var parts = the_string.split(',', 2);

    var tickr_symbol = parts[1].trim();
  //  alert(tickr_symbol);

 //   console.log("scope.result " + $scope.result );

    angular.forEach($scope.result, function(value,key) {


   //   console.log("value , key " + value + ' , ' + key );

      if(value.Ticker == tickr_symbol){

    //   alert("This value already exists");

      }
      else{
     //   alert("2...");
        }
    //  console.log(value.Ticker);
    });



  //  alert("123.. " + parts[1]);

    var url = "http://query.yahooapis.com/v1/public/yql?q=";
    var uriComponent = "select * from yahoo.finance.quotes where symbol in ('" + tickr_symbol + "')";
    var data = encodeURIComponent(uriComponent);
    var end = "&format=json&diagnostics=true&env=http://datatables.org/alltables.env";
    var jsoncallback = "&callback=JSON_CALLBACK";

    var final_url = url + data + end ;

    $http.get(final_url)
            .success(function(data){
                  x = x+1;
             //   alert("success");
             //   alert("Parts[1] - " + parts[1]);
            //    alert("LastTradePriceOnly - " + data.query.results.quote.LastTradePriceOnly);

              var change = data.query.results.quote.Change_PercentChange;
              percent_change = change.split(" ");
         //     alert(percent_change[percent_change.length - 1]);

              // if(percent_change[0].toString().indexOf('-') === -1){
              //   value = "green";
              // } else{
              //   value = "red";
              // }

                var myarray = [
                    x, //0
                    tickr_symbol, //1
                    parts[0], //2
                    data.query.results.quote.LastTradePriceOnly, //3
                    percent_change[0], //4
                    percent_change[percent_change.length - 1], //5
                    data.query.results.quote.PERatio, //6
                    data.query.results.quote.PEGRatio, //7
                    data.query.results.quote.PriceSales, //8
                    data.query.results.quote.PriceBook, //9
                    data.query.results.quote.DividendYield, //10
                ];


            updateFunction(myarray);

          })


  }
  };



  function updateFunction(per){
        //   alert("inside update function. per.length = " + per.length);

            while(per != ''){
                $scope.result.unshift({
                                 "Number": x,
                                 "Ticker": per[1],
                                 "Company": per[2],
                                 "Last Trade Price": per[3],
                                 "Change": per[4],
                                 "Percent Change": per[5],
                                 "PER Ratio": per[6],
                                 "PEG Ratio": per[7],
                                 "Price Sales": per[8],
                                 "Price Book": per[9],
                                 "Dividend Yield": per[10]
                                });
                per = '';

             //  console.log($scope.result);
            }
           // $scope.result.reverse();
    };

    // pagination code starts

    $scope.range = function() {
    var rangeSize = 5;
    var ret = [];
    var start;

    start = $scope.currentPage;
 //   alert($scope.pageCount());
    if ( start > $scope.pageCount()-rangeSize ) {
   //   alert("lets see if this works");
      start = $scope.pageCount()-rangeSize+1;
   //   alert(start);
    }

    for (var i=start; i<start+rangeSize; i++) {
   //   alert(i);
      ret.push(i);
    }
    return ret;
  };

  $scope.prevPage = function() {
    if ($scope.currentPage > 0) {
      $scope.currentPage--;
    }
  };

  $scope.prevPageDisabled = function() {
    return $scope.currentPage === 0 ? "disabled" : "";
  };

  $scope.pageCount = function() {
    if($scope.result == 0)
      return 0;
    else
      return Math.ceil($scope.result.length/$scope.itemsPerPage)-1;
  };

  $scope.nextPage = function() {
    if ($scope.currentPage < $scope.pageCount()) {
      $scope.currentPage++;
    }
  };

  $scope.nextPageDisabled = function() {
    return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
  };

  $scope.setPage = function(n) {
    $scope.currentPage = n;
  };

  // pagination code ends

  function noInputStringAlert() {
    alert("No input string alert");
  };

  $scope.header = [{
    "title": "Ticker",
    "flag": 1,
    "subtitle": ""
  },{
    "title": "Company",
    "flag": 1,
    "subtitle": ""
  },{
    "title": "Last Trade Price",
    "flag": 1,
    "subtitle": ""
  },{
    "title": "Change",
    "flag": 1,
    "subtitle": ""
  },{
    "title": "Percent Change",
    "flag": 1,
    "subtitle": ""
  },{
    "title": "Price Ratios",
    "flag": 0,
    "subtitle": "PER Ratio",
    "type": "string",
    "checked": true
  },{
    "title": "Price Ratios",
    "flag": 0,
    "subtitle": "PEG Ratio",
    "type": "number",
    "checked": true
  }, {
    "title": "Price Ratios",
    "flag": 0,
    "subtitle": "Price Sales",
    "type": "string",
    "checked": true
  }, {
    "title": "Price Ratios",
    "flag": 0,
    "subtitle": "Price Book",
    "type": "string",
    "checked": true
  }, {
    "title": "Price Ratios",
    "flag": 0,
    "subtitle": "Dividend Yield",
    "type": "string",
    "checked": true
  }, {
    "title": "Statistics",
    "subtitle": "Days Range",
    "flag": 1,
    "type": "string",
    "checked": true
  }, {
    "title": "Statistics",
    "subtitle": "Price Estimate Current Year",
    "flag": 0,
    "type": "string",
    "checked": true
  }, {
    "title": "Statistics",
    "subtitle": "50 Day Moving Average",
    "flag": 0,
    "type": "string",
    "checked": true
  }
  ];


  $scope.$watch('header', function() {
    update_characteristics();
  }, true);


  var update_characteristics = function() {
    //console.log($scope.header.length);
    $scope.title2_child = [];
    $scope.characteristics_child = [];
    $scope.header_main = [];

    var characteristics = [5,6,7,8,9];
    var Title2 = [10,11,12,13];

    for (var i = 0; i < $scope.header.length; i++) {
      var column = $scope.header[i];
      if(i == 0 || i == 1 || i == 2 || i == 3 || i == 4){
        $scope.header_main.push(column);
      }

      if(characteristics.indexOf(i) != -1){
            if (column.checked) {
            $scope.characteristics_child.push(column);
          //  console.log(column);
            }
      }
      if(Title2.indexOf(i) != -1){
            if (column.checked) {
            $scope.title2_child.push(column);
           // console.log(column);
            }
      }
    }
  };


  // code to remove row starts

  $scope.rowToDelete = null;

  $scope.deleteRow = function (xyz) {
  //  alert("inside delete row .. " + xyz );
    $scope.result.splice(xyz,1)
    //  console.log($scope.rowToDelete);
  };
  // code to remove row ends


  //code to color change and percent_change starts

  $scope.set_color = function (value) {

//    function set_color(value) {

   //   console.log(value);

    if(value.toString().indexOf('-') === -1){
                return {
                color: "green"
                }
              } else{
                return {
                color: "red"
                }
              }
    }
  //code to color change and percent_change ends

}]);
