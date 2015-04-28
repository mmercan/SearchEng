(function() {
    angular.module("app").controller("formadvancedCtrl", [
        "$scope", "$http", "$routeParams", "$location", "dataContext", function($scope, $http, $routeParams, $location, dataContext) {
          
            $scope.knobnumber = 75;
            $scope.isSelected = true;
            $scope.selectedFirst = ["OR", "HI"];
            $scope.selectedListItem = "OR";
            $scope.sListItem = ["1","2","4"];
            $scope.switchertemplate = {
                on_state_content: '<span class="fa fa-check"></span>',
                off_state_content: '<span class="fa fa-times"></span>'
            };
            $scope.mydate = "17/03/1981";




            function movieFormatResult(movie) {
                var markup = "<table class='movie-result'><tr>";
                if (movie.posters !== undefined && movie.posters.thumbnail !== undefined) {
                    markup += "<td class='movie-image' style='vertical-align: top'><img src='" + movie.posters.thumbnail + "' style='max-width: 60px; display: inline-block; margin-right: 10px; margin-left: 10px;' /></td>";
                }
                markup += "<td class='movie-info'><div class='movie-title' style='font-weight: 600; color: #000; margin-bottom: 6px;'>" + movie.title + "</div>";
                if (movie.critics_consensus !== undefined) {
                    markup += "<div class='movie-synopsis'>" + movie.critics_consensus + "</div>";
                } else if (movie.synopsis !== undefined) {
                    markup += "<div class='movie-synopsis'>" + movie.synopsis + "</div>";
                }
                markup += "</td></tr></table>";
                return markup;
            }

            function movieFormatSelection(movie) {
                return movie.title;
            }


            $scope.citylist = [
                { value: "AK", name: "Alaska" }, { value: "HI", name: "Hawaii" }, { value: "CA", name: "California" }, { value: "NV", name: "Nevada" }, { value: "OR", name: "Oregon" }, { value: "WA", name: "Washington" }, { value: "AZ", name: "Arizona" }, { value: "CO", name: "Colorado" }, { value: "ID", name: "Idaho" }, { value: "MT", name: "Montana" }, { value: "NE", name: "Nebraska" }, { value: "NM", name: "New Mexico" }, { value: "ND", name: "North Dakota" }, { value: "UT", name: "Utah" }, { value: "WY", name: "Wyoming" }, { value: "AL", name: "Alabama" }, { value: "AR", name: "Arkansas" }, { value: "IL", name: "Illinois" }, { value: "IA", name: "Iowa" }, { value: "KS", name: "Kansas" }, { value: "KY", name: "Kentucky" }, { value: "LA", name: "Louisiana" }, { value: "MN", name: "Minnesota" }, { value: "MS", name: "Mississippi" }, { value: "MO", name: "Missouri" }, { value: "OK", name: "Oklahoma" }, { value: "SD", name: "South Dakota" }, { value: "TX", name: "Texas" }, { value: "TN", name: "Tennessee" }, { value: "WI", name: "Wisconsin" }, { value: "CT", name: "Connecticut" }, { value: "DE", name: "Delaware" }, { value: "FL", name: "Florida" }, { value: "GA", name: "Georgia" }, { value: "IN", name: "Indiana" }, { value: "ME", name: "Maine" }, { value: "MD", name: "Maryland" }, { value: "MA", name: "Massachusetts" }, { value: "MI", name: "Michigan" }, { value: "NH", name: "New Hampshire" }, { value: "NJ", name: "New Jersey" }, { value: "NY", name: "New York" }, { value: "NC", name: "North Carolina" }, { value: "OH", name: "Ohio" }, { value: "PA", name: "Pennsylvania" }, { value: "RI", name: "Rhode Island" }, { value: "SC", name: "South Carolina" }, { value: "VT", name: "Vermont" }, { value: "VA", name: "Virginia" }, { value: "WV", name: "West Virginia" }
            ];

            $scope.timezonelist = [{
                label: "Alaskan/Hawaiian Time Zone", cities: [
                            { value: "AK", name: "Alaska" },
                            { value: "HI", name: "Hawaii" }]
            }, {
                label: "Pacific Time Zone", cities: [
                 { value: "CA", name: "California" },
                 { value: "NV", name: "Nevada" },
                 { value: "OR", name: "Oregon" },
                 { value: "WA", name: "Washington" }]
            }, {
                label: "Mountain Time Zone", cities: [
                 { value: "AZ", name: "Arizona" },
                 { value: "CO", name: "Colorado" },
                 { value: "ID", name: "Idaho" },
                 { value: "MT", name: "Montana" },
                 { value: "NE", name: "Nebraska" },
                 { value: "NM", name: "New Mexico" },
                 { value: "ND", name: "North Dakota" },
                 { value: "UT", name: "Utah" },
                 { value: "WY", name: "Wyoming" }]
            }, {
                label: "Central Time Zone", cities: [
                 { value: "AL", name: "Alabama" },
                 { value: "AR", name: "Arkansas" },
                 { value: "IL", name: "Illinois" },
                 { value: "IA", name: "Iowa" },
                 { value: "KS", name: "Kansas" },
                 { value: "KY", name: "Kentucky" },
                 { value: "LA", name: "Louisiana" },
                 { value: "MN", name: "Minnesota" },
                 { value: "MS", name: "Mississippi" },
                 { value: "MO", name: "Missouri" },
                 { value: "OK", name: "Oklahoma" },
                 { value: "SD", name: "South Dakota" },
                 { value: "TX", name: "Texas" },
                 { value: "TN", name: "Tennessee" },
                 { value: "WI", name: "Wisconsin" }]
            }, {
                label: "Eastern Time Zone", cities: [
                 { value: "CT", name: "Connecticut" },
                 { value: "DE", name: "Delaware" },
                 { value: "FL", name: "Florida" },
                 { value: "GA", name: "Georgia" },
                 { value: "IN", name: "Indiana" },
                 { value: "ME", name: "Maine" },
                 { value: "MD", name: "Maryland" },
                 { value: "MA", name: "Massachusetts" },
                 { value: "MI", name: "Michigan" },
                 { value: "NH", name: "New Hampshire" },
                 { value: "NJ", name: "New Jersey" },
                 { value: "NY", name: "New York" },
                 { value: "NC", name: "North Carolina" },
                 { value: "OH", name: "Ohio" },
                 { value: "PA", name: "Pennsylvania" },
                 { value: "RI", name: "Rhode Island" },
                 { value: "SC", name: "South Carolina" },
                 { value: "VT", name: "Vermont" },
                 { value: "VA", name: "Virginia" },
                 { value: "WV", name: "West Virginia" }]
            }];



            $scope.multi2Value = [
    { id: 'CT', text: 'Connecticut' },
    { id: 'DE', text: 'Delaware' }];


            $scope.multi = {
                multiple: true,
                query: function (query) {
                    query.callback({ results: states });
                },
                initSelection: function (element, callback) {
                    var val = $(element).select2('val'),
                      results = [];
                    for (var i = 0; i < val.length; i++) {
                        results.push(findState(val[i]));
                    }
                    callback(results);
                }
            };
        }
    ]);
})();