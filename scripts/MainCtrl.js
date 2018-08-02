/* global angular */
(function() {
  console.clear();

  'use strict';

  var app = angular.module('formlyExample', ['formly', 'ngMessages', 'formlyBootstrap', 'ui.bootstrap', 'ngFileUpload'], function config(formlyConfigProvider) {
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
        $scope.confirmRemove = confirmRemove;
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

        function confirmRemove(index) {
          var reset = confirm("Are you sure you would like to remove this section?");
          if (reset == true){
            $scope.model[$scope.options.key].splice(index, 1);
          }
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

    formlyConfig.setType({
       name: 'ng-file-upload',
       extends: 'input',
       templateUrl: 'ng-file.html'
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
      var data = JSON.stringify(vm.model);// this is your data that you want to pass to the server (could be json)
      var http = new XMLHttpRequest();
      var url = 'senddata.php';
      http.open('POST', url, true);

      //Send the proper header information along with the request
      http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

      http.onreadystatechange = function() {//Call a function when the state changes.
          if(http.readyState == 4 && http.status == 200) {
              // alert(http.responseText);
          }
      }
      http.send(data);
      console.log(data);

      alert("Thank you for submitting your project summary.");
      vm.options.resetModel();
    }

    function confirmreset() {
      var reset = confirm("Are you sure you would like to clear this form?");
      if (reset == true){
        vm.options.resetModel();
      }
    }



    function init() {

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
                  label: 'Project Name Or Target/Company Name',
                  placeholder: 'Enter project Name',
                  required: true,
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
                    return RegExp('^[0-9]{1,3}(,[0-9]{3})*$').test(value);
                  },
                  message: '$viewValue + " is not a valid purchase price."'
                }
              },
              templateOptions: {
                  type: 'text',
                  label: 'Purchase Price',
                  addonLeft: {
                    text: "$"
                  },
                  placeholder: '1,000,000,000',
                  required: true
              },
            },
          ]
        },
        {
          className: 'row',
          fieldGroup:[
            {
              className: 'col-xs-4',
              key: 'project_type',
              type: 'select',
              templateOptions: {
                  label: 'Project Type',
                  options: [
                    {name: 'Private Equity M&A', value: 'private_equity_mna'},
                    {name: 'Public M&A', value: 'public_mna'},
                    {name: 'Financing', value: 'financing'},
                    {name: 'Capital Markets', value: 'capital_markets'},
                    {name: 'Other', value: 'other'},
               ],
                  required: true
              }
            },
            {
              className: 'col-xs-4',
              key: 'other_project',
              type: 'input',
              templateOptions: {
                  label: 'Other Project Type',
                    required: false
              },

              expressionProperties: {
                'templateOptions.disabled': function($viewValue, $modelValue, scope) {
                  return scope.model.project_type !== 'other';
                }
              },
            },

              // hideExpression: function($viewValue, $modelValue, scope) {
              //         return scope.model.project_type !== 'other';
              //       },

            
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

            {
              className: "col-xs-4",
              key: 'working_group_list',
              type: 'ng-file-upload',
              templateOptions: {
                label: 'Upload Working Group List'
              }
            }, 
          ]
        },
        {
          className: 'row',
          fieldGroup: [
            {
              className: 'col-xs-6',
              key: 'kirkland_client',
              type: 'input',
              templateOptions: {
                type: 'text',
                label: 'Kirkland Client',
                placeholder: 'Enter the client\'s name',
                required: true
              }
            },
            {
              className: 'col-xs-6',
              key: 'kirkland_role',
              type: 'select',
              templateOptions: {
                label: 'Kirkland Role',
                options: [
                  {name: 'Buyside', value: 'buyside'},
                  {name: 'Sellside', value: 'sellside'},
                  {name: 'Lender', value: 'lender'},
                  {name: 'Borrower', value: 'borrower'}
                ],
                required: true
              }
            },
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
                    // {
                    //   template: '<hr style="border-top: dotted 3px;"/>'
                    // },

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
                            label: 'Client (e.g. name of entity represented by firm)',
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
                              {name: 'Lender', value: 'lender'},
                              {name: 'Borrower', value: 'borrower'}
                            ],
                            required: true
                          }
                        },
                      ]
                    },

                    // {
                    //   template: '<hr style="border-top: dotted 3px;"/>'
                    // },

                    //Begin the repeated Lawyer Section

                    {
                      type: 'repeatSection',
                      key: 'attorneys',
                      templateOptions: 
                        {
                          btnText: "Add Another Attorney",
                          btnColor: "#7742f4",
                          btnHoverColor: "#fff",
                          btnBorder: "#6537ce",
                          removebtnText: "Remove Attorney",
                          fields: 
                            [
                              {
                                className: 'row',
                                fieldGroup: [
                                  {
                                    className: 'col-xs-3',
                                    type: 'input',
                                    key: 'firstName',
                                    templateOptions: {
                                      label: 'First Name',
                                      placeholder: 'Enter attorney\'s first name',
                                      required: true
                                    }
                                  },
                                  {
                                    className: 'col-xs-3',
                                    type: 'input',
                                    key: 'lastName',
                                    templateOptions: {
                                      label: 'Last Name',
                                      placeholder: 'Enter attorney\'s last name',
                                      required: true
                                    },
                                  },
                                  {
                                    className: 'col-xs-3',
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
                                    type: "radioType",
                                    key: "performance",
                                    templateOptions: {
                                      inline: true,
                                      label: "Performance - 5 is perfect",
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
                                  }
                                ]
                              },
                              {
                                className: 'row',
                                fieldGroup:[
                                  {
                                    className: 'col-xs-3',
                                    key: 'title',
                                    type: 'select',
                                    templateOptions: {
                                      label: 'Title',
                                      options: [
                                        {name: 'Partner', value: 'partner'},
                                        {name: 'Associate', value: 'associate'},
                                        {name: 'Counsel', value: 'counsel'},
                                      ],
                                      required: false
                                    }
                                  },
                                  {
                                    className: 'col-xs-3',
                                    key: 'role',
                                    type: 'select',
                                    templateOptions: {
                                      label: 'Role',
                                      options: [
                                        {name: 'M&A', value: 'mna'},
                                        {name: 'Finance', value: 'finance'},
                                        {name: 'Tax', value: 'tax'},
                                        {name: 'Intellectual Property', value: 'ip'},
                                        {name: 'Real Estate', value: 'realestate'},
                                        {name: 'Labor/Executive Compensation/Benefits', value: 'l_ec_b'},
                                        {name: 'Other', value: 'other'},
                                      ],
                                      required: false
                                    }
                                  },
                                  {
                                    className: 'col-xs-3',
                                    key: 'other_role',
                                    type: 'input',
                                    templateOptions: {
                                        label: 'Other Role',
                                          required: false,
                                          disabled: true
                                    },

                                    expressionProperties: {
                                      'templateOptions.disabled': function($viewValue, $modelValue, scope) {
                                        return scope.model.role !== 'other';
                                      }
                                    },

                                    // hideExpression: function($viewValue, $modelValue, scope) {
                                    //         return scope.model.role !== 'other';
                                    //       },

                                  },
                                  {
                                    className: 'col-xs-3',
                                    type: 'select',
                                    key: 'classyear',
                                    templateOptions: {
                                      label: 'Class Year',
                                      placeholder: 'Enter attorney\'s class year',
                                      options: [
                                        {name: '2018', value: '2018'},
                                        {name: '2017', value: '2017'},
                                        {name: '2016', value: '2016'},
                                        {name: '2015', value: '2015'},
                                        {name: '2014', value: '2014'},
                                        {name: '2013', value: '2013'},
                                        {name: '2012', value: '2012'},
                                        {name: '2011', value: '2011'},
                                        {name: '2010', value: '2010'},
                                        {name: '2009', value: '2009'},
                                        {name: '2008', value: '2008'},
                                        {name: '2007', value: '2007'},
                                        {name: '2006', value: '2006'},
                                        {name: '2005', value: '2005'},
                                        {name: '2004', value: '2004'},
                                        {name: '2003', value: '2003'},
                                        {name: '2002', value: '2002'},
                                        {name: '2001', value: '2001'},
                                        {name: '2000', value: '2000'},
                                        {name: '1999', value: '1999'},
                                        {name: '1998', value: '1998'},
                                        {name: '1997', value: '1997'},
                                        {name: '1996', value: '1996'},
                                        {name: '1995', value: '1995'},
                                        {name: '1994', value: '1994'},
                                        {name: '1993', value: '1993'},
                                        {name: '1992', value: '1992'},
                                        {name: '1991', value: '1991'},
                                        {name: '1990', value: '1990'},
                                      ],
                                      required: false
                                    }
                                  },
                                ]
                              },
                              {
                                className: 'row',
                                fieldGroup: [
                                  {
                                    //className: 'col-xs-9',
                                    type: 'input',
                                    key: 'firmlink',
                                    templateOptions: {
                                      label: 'Firm Link',
                                      placeholder: 'Enter attorney\'s firm link',
                                      required: false
                                    },
                                  }
                                ]
                              },
                             
                              // {
                              //   template: '<hr style="border-top: dashed 1px; border-color:black;"/>'
                              // }
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

