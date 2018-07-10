/* global angular */
(function() {
  console.clear();

  'use strict';

  var app = angular.module('formlyExample', ['formly', 'ngMessages', 'formlyBootstrap', 'ui.bootstrap'], function config(formlyConfigProvider) {
    var unique = 1;


    formlyConfigProvider.setWrapper([
      {
        template: [
          '<div class="formly-template-wrapper form-group"',
            'ng-class="{\'has-error\': options.validation.errorExistsAndShouldBeVisible}">',
            '<formly-transclude></formly-transclude>',
              '<div class="validation"',
              'ng-if="options.validation.errorExistsAndShouldBeVisible"',
              'ng-messages="options.formControl.$error">',
                '<div ng-messages-include="validation.html"></div>',
                '<div ng-message="{{::name}}" ng-repeat="(name, message) in ::options.validation.messages">',
                '{{message(options.formControl.$viewValue, options.formControl.$modelValue, this)}}',
                '</div>',
              '</div>',
          '</div>'
        ].join(' ')
      },
    ]);

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
          var lastSection = repeatsection[repeatsection.length];
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

  app.run(function(formlyConfig, formlyValidationMessages) {
    formlyValidationMessages.messages.pattern = function(viewValue, modelValue, scope) {
      return viewValue + 'is invalid';
    };

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
    vm.confirmreset = confirmreset;

    // variable assignment
    vm.author = { // optionally fill in your info below :-)
      name: 'Gal Ben-Chanoch',
    };
    vm.Title = 'Project Sumary and Working Group List'; // add this
    vm.env = {
      angularVersion: angular.version.full,
      formlyVersion: formlyVersion
    };
    vm.options = {

    };

    init();

    vm.originalFields = angular.copy(vm.fields);

    function onSubmit() {
      // var data = JSON.stringify(vm.model);// this is your data that you want to pass to the server (could be json)
      // var http = new XMLHttpRequest();
      // var url = 'senddata.php';
      // http.open('POST', url, true);

      // //Send the proper header information along with the request
      // http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

      // http.onreadystatechange = function() {//Call a function when the state changes.
      //     if(http.readyState == 4 && http.status == 200) {
      //         // alert(http.responseText);
      //     }
      // }
      // http.send(data);
      // console.log(data);

      alert("Thank you for submitting your project summary.");
      vm.options.resetModel();
    }

    function confirmreset() {
      var reset = confirm("Are you sure you would like to reset this form?");
      if (reset == true){
        vm.options.resetModel();
      }
    }

    function init() {
      // vm.model = {
      //     firms: [
      //       {
      //         firm: "Kirkland",
      //         // parties: [
      //         //   {
      //         //     firstName: "",
      //         //     lastName: "",
      //         //   },
      //         // ]
      //       },
      //     ] 
      // };

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
                  // datepickerPopup: "dd-MM-YYYY",
                  required: true

              }
            },
            {
              className: 'col-xs-3',
              key: 'purchase_price',
              type: 'input',
              validators: {
                valid_purchase_price: {
                  expression: function(viewValue, modelValue) {
                    var value = modelValue || viewValue;
                    return RegExp('^\\$[0-9]{1,3}(,[0-9]{3})*$').test(value);
                  },
                  message: '$viewValue + " is not a valid purchase price."'
                }
              },
              templateOptions: {
                  type: 'text',
                  label: 'Purchase Price',
                  placeholder: '$1,000,000,000',
                  required: true
              },
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

        //Begin the Repeated Firm Section
        {
          type: 'repeatSection',
          key: 'firms',
          templateOptions:
              { 
                btnText: 'Add Another Firm',
                btnColor: '#b241f4',
                btnBorder: '#8e33c4',
                removebtnText: 'Remove Firm',
                fields: 
                  [
                    {
                      template: '<hr style="border-top: dotted 3px;"/>'
                    },

                    {
                      className: 'row',
                      fieldGroup: [
                        {
                          className: 'col-xs-4',
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
                          className: 'col-xs-4',
                          key: 'client',
                          type: 'input',
                          templateOptions: {
                            type: 'text',
                            label: 'Client',
                            placeholder: 'Enter the client\'s name',
                            required: true
                          }
                        },
                        {
                          className: 'col-xs-4',
                          key: 'firm_role',
                          type: 'select',
                          templateOptions: {
                            label: 'Firm\'s Role',
                            options: [
                              {name: 'Buyside', value: 'buyside'},
                              {name: 'Sellside', value: 'sellside'},
                            ],
                            required: true
                          }
                        },
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
                          btnColor: "#7742f4",
                          btnBorder: "#6537ce",
                          removebtnText: "Remove Party",
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
                                      label: 'First Name',
                                      placeholder: 'Enter party\'s first name',
                                      required: true
                                    }
                                  },
                                  {
                                    className: 'col-xs-6',
                                    type: 'input',
                                    key: 'lastName',
                                    templateOptions: {
                                      label: 'Last Name',
                                      placeholder: 'Enter party\'s last name',
                                      required: true
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
                                    key: 'position',
                                    type: 'select',
                                    templateOptions: {
                                      label: 'Position',
                                      options: [
                                        {name: 'Partner', value: 'partner'},
                                        {name: 'Associate', value: 'associate'},
                                        {name: 'Council', value: 'council'},
                                      ],
                                      required: true
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
                                      ],
                                      required: true
                                    }
                                  },
                                ]
                              },
                              {
                                template: '<hr style="border-top: dashed 1px; border-color:white;"/>'
                              }
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

