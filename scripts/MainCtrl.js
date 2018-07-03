/* global angular */
(function() {
  console.clear();

  'use strict';

  var app = angular.module('formlyExample', ['formly', 'formlyBootstrap', 'ui.bootstrap'], function config(formlyConfigProvider) {
    var unique = 1;

    formlyConfigProvider.setType({
      name: 'repeatSection',
      templateUrl: 'repeatSection.html',
      controller: function($scope) {
        $scope.formOptions = {formState: $scope.formState};
        $scope.addNew = addNew;
        
        $scope.copyFields = copyFields;
        
        
        function copyFields(fields) {
          fields = angular.copy(fields);
          addRandomIds(fields);
          return fields;
        }
        
        function addNew() {
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          var repeatsection = $scope.model[$scope.options.key];
          var lastSection = repeatsection[repeatsection.length - 1];
          var newsection = {};
          if (lastSection) {
            newsection = angular.copy(lastSection);
          }
          repeatsection.push(newsection);
        }
        
        function addRandomIds(fields) {
          unique++;
          angular.forEach(fields, function(field, index) {
            if (field.fieldGroup) {
              addRandomIds(field.fieldGroup);
              return; // fieldGroups don't need an ID
            }
            
            if (field.templateOptions && field.templateOptions.fields) {
              addRandomIds(field.templateOptions.fields);
            }
            
            field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
          });
        }
        
        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }
      }
    });
  });

  app.run(function(formlyConfig) {
    formlyConfig.setType({
      name: 'radioType',
      extends: 'radio',
      templateUrl: "inline-radio.html",
    });

    var attributes = [
    'date-disabled',
    'custom-class',
    'show-weeks',
    'starting-day',
    'init-date',
    'min-mode',
    'max-mode',
    'format-day',
    'format-month',
    'format-year',
    'format-day-header',
    'format-day-title',
    'format-month-title',
    'year-range',
    'shortcut-propagation',
    'datepicker-popup',
    'show-button-bar',
    'current-text',
    'clear-text',
    'close-text',
    'close-on-date-selection',
    'datepicker-append-to-body'
    ];

    var bindings = [
      'datepicker-mode',
      'min-date',
      'max-date'
    ];

    var ngModelAttrs = {};

    angular.forEach(attributes, function(attr) {
      ngModelAttrs[camelize(attr)] = {attribute: attr};
    });

    angular.forEach(bindings, function(binding) {
      ngModelAttrs[camelize(binding)] = {bound: binding};
    });

    console.log(ngModelAttrs);
    
    formlyConfig.setType({
      name: 'datepicker',
      templateUrl:  'datepicker.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      defaultOptions: {
        ngModelAttrs: ngModelAttrs,
        templateOptions: {
          datepickerOptions: {
            format: 'MM.dd.yyyy',
            initDate: new Date()
          }
        }
      },
      controller: ['$scope', function ($scope) {
        $scope.datepicker = {};

        $scope.datepicker.opened = false;

        $scope.datepicker.open = function ($event) {
          $scope.datepicker.opened = !$scope.datepicker.opened;
        };
      }]
    });

    function camelize(string) {
        string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
          return chr ? chr.toUpperCase() : '';
        });
        // Ensure 1st char is always lowercase
        return string.replace(/^([A-Z])/, function(match, chr) {
          return chr ? chr.toLowerCase() : '';
        });
      }
  });

  app.controller('MainCtrl', function MainCtrl(formlyVersion) {
    var vm = this;
    // funcation assignment
    vm.onSubmit = onSubmit;

    // variable assignment
    vm.author = { // optionally fill in your info below :-)
      name: 'Gal Ben-Chanoch',
    };
    vm.Title = 'Project Sumary and Working Group List'; // add this
    vm.env = {
      angularVersion: angular.version.full,
      formlyVersion: formlyVersion
    };
    vm.options = {};

    init();

    vm.originalFields = angular.copy(vm.fields);

    // function sendData() {
    //   var data = JSON.stringify(vm.model);// this is your data that you want to pass to the server (could be json)
    //   var http = new XMLHttpRequest();
    //   var url = 'get_data.php';
    //   var params = 'orem=ipsum&name=binny';
    //   http.open('POST', url, true);

    //   //Send the proper header information along with the request
    //   http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    //   http.onreadystatechange = function() {//Call a function when the state changes.
    //       if(http.readyState == 4 && http.status == 200) {
    //           alert(http.responseText);
    //       }
    //   }

    //   http.send(data);
    // }

    function onSubmit() {
      var data = JSON.stringify(vm.model);
      alert("Thank you for submitting your project summary.")
      vm.options.resetModel()
    }


    function init() {
      vm.model = {
        
          firms: [
            {
              firm: "Kirkland",
              parties: [
                {
                  firstName: "John",
                  lastName: "Smith",
                },
              ]
            },
          ] 
      };

      vm.fields = 
      [
        {
          className: 'row',
          fieldGroup:[
            {
              className: 'col-xs-6',
              key: 'project',
              type: 'input',
              templateOptions: {
                  type: 'text',
                  label: 'Project Name',
                  placeholder: 'Enter project Name',
                  required: true
              }
            },
            {
              className: 'col-xs-3',
              key: 'closing_date',
              type: 'datepicker',
              templateOptions: {
                  type: 'text',
                  label: 'Closing Date',
                  datepickerPopup: "dd-MMMM-yyyy",
                  required: true

              }
            },
            {
              className: 'col-xs-3',
              key: 'purchase_price',
              type: 'input',
              templateOptions: {
                  type: 'text',
                  label: 'Purchase Price',
                  placeholder: 'Enter purchase price',
                  required: true
              }
            },
          ]
        },
        {
          className: 'row',
          fieldGroup:[
            {
              //className: 'col-xs-6',
              key: 'project_type',
              type: 'select',
              templateOptions: {
                  label: 'Project Type',
                  options: [
                    {name: 'Private Equity: M&A', value: 'mna'},
                    // {name: 'Equity', value: 'eq'},
               ],
                  required: true
              }
            },
            // {
            //   className: 'col-xs-6',
            //   key: 'mna_field',
            //   type: 'select',
            //   templateOptions: {
            //       label: 'Project Subtype',
            //       options: [
            //         {name: 'Buyside', value: 'mna_1'},
            //         {name: 'Sellside', value: 'eq_1'},
            //       ],
            //         required: true
            //   },
            //   hideExpression: function($viewValue, $modelValue, scope) {
            //           return scope.model.project_type !== 'mna';
            //         },
            // },
          ]
        },

        {
          template: '<hr style="border-color:white;"/>'
        },

        //Begin the Repeated Firm Section
        {
          type: 'repeatSection',
          key: 'firms',
          templateOptions:
              { 
                btnText: "Add Another Firm",
                fields: 
                  [
                    {
                      template: '<hr style="border-top: dotted 3px;"/>'
                    },

                    {
                      className: 'row',
                      fieldGroup: [
                        {
                          className: 'col-xs-6',
                          key: 'firm',
                          type: 'input',
                          templateOptions: {
                              type: 'text',
                              label: 'Firm',
                              placeholder: 'Enter the firm\'s name',
                              required: true
                          }
                        },
                        {
                          className: 'col-xs-6',
                          key: 'client',
                          type: 'input',
                          templateOptions: {
                              type: 'text',
                              label: 'Client',
                              placeholder: 'Enter the client\'s name',
                              required: true
                          }
                        }
                      ]
                    },

                    {
                      template: '<hr style="border-top: dotted 3px;"/>'
                    },

                    //Begin the repeated Lawyer Section

                    {
                      type: 'repeatSection',
                      key: 'parties',
                      templateOptions: 
                        {
                          btnText: "Add Another Party",
                          fields: 
                            [
                              {
                                className: 'row',
                                fieldGroup: [
                                  {
                                    className: 'col-xs-6',
                                    type: 'input',
                                    key: 'firstName',
                                    templateOptions: {
                                      label: 'First Name'
                                    }
                                  },
                                  {
                                    className: 'col-xs-6',
                                    type: 'input',
                                    key: 'lastName',
                                    templateOptions: {
                                      label: 'Last Name'
                                    },
                                  }
                                ]
                              },
                              {
                                className: 'row',
                                fieldGroup:[
                                  {
                                    className: 'col-xs-6',
                                    key: 'email',
                                    type: 'input',
                                    templateOptions: {
                                      type: 'email',
                                      label: 'Email',
                                      placeholder: 'Enter email',
                                      required: true
                                    }
                                  },
                                  {
                                    className: 'col-xs-3',
                                    key: 'role',
                                    type: 'select',
                                    templateOptions: {
                                      label: 'Role',
                                      options: [
                                        {name: 'Partner', value: 'partner'},
                                        {name: 'Associate', value: 'associate'},
                                      ],

                                    }
                                  },
                                  {
                                    className: 'col-xs-3',
                                    type: "radioType",
                                    key: "performance",
                                    templateOptions: {
                                      inline: true,
                                      label: "Performance (5 is perfect)",
                                      // theme: "custom",
                                      labelProp: "score",
                                      valueProp: "id",
                                      options: [
                                          {score: "1", id: 1},
                                          {score: "2", id: 2},
                                          {score: "3", id: 3},
                                          {score: "4", id: 4},
                                          {score: "5", id: 5}
                                      ]
                                    }
                                  },
                                ]
                              },
                            ]
                          }
                      }, 
                  ]
              }
            },
        ];
    }
  });

})();