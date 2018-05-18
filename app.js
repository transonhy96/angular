
const app = angular.module('myapp',['ngRoute','angularModalService']);

app.config(['$routeProvider','$locationProvider',($routeProvider,$locationProvider)=>{
    $routeProvider
    .when('/',{
        templateUrl:'views/students.html',
        controller:'studentsCtrl'
    })
    .when('/students',{
        templateUrl:'views/students.html',
        controller:'studentsCtrl'
    })
    .when('/abouts',{
        templateUrl:'views/about.html',
        controller:'aboutsCtrl'
    })
    .otherwise({
        redirectTo:'/'
    });
    $locationProvider.html5Mode(true);
}]);

app.controller('pagesCtrl',['$scope','dataService',function($scope,dataService){

}]);
app.controller('ModalController',['$scope','$rootScope','dataService','$location','close', function($scope,$rootScope,dataService,$location,close) {
    var datas = [];
    $scope.onSave =function(){
        console.log($rootScope);
        let name =$scope.modal.name;
        let age = $scope.modal.age;
        let address= $scope.modal.address;
        let phone=$scope.modal.phone ;
        console.log(name,age,address,phone);
        dataService.addStudent('http://server/api/student/add',name,age,address,phone);
        dataService.getAll('http://server/api/students')
            .then(res => {
                $rootScope.students = res.data;
                datas = res.data;
            })
        .catch(reject=>console.error(reject));
        
        
    };
    dataService.setData(datas);
    
  }]);
app.controller('studentsCtrl',['$scope','$rootScope','dataService','ModalService','$location',function($scope,$rootScope,dataService,ModalService,$location){
    
    $rootScope.students =dataService.getData();
    dataService.getAll('http://server/api/students')
            .then(res => {
                $rootScope.students = res.data;
            })
            .catch(reject=>console.error(reject));
    $scope.deleteStudent = (index)=>{
       
        $rootScope.students.splice(index,1);
        dataService.removeStudent('http://server/api/student/delete/',index)
        .then(res=>console.log(res))
        .catch(err=>console.log(err));
        dataService.getAll('http://server/api/students')
        .then(res => {
        $rootScope.students = res.data;
        
        })
        .catch(reject=>console.error(reject));
        
        

    };
    $scope.updateStudent = (student)=>{
        
        ModalService.showModal({
            templateUrl: "/views/update-modal.html",
            controller: "ModalController",
            inputs: {
                name: student.name,
                age: student.age,
                address:student.address,
                phone:student.phone
              }
          }).then(function(modal) {
    
            
            modal.element.modal();
            modal.close.then(function(result) {
               
              });
          });
        

    };
    $scope.addStudent = (index)=>{
        ModalService.showModal({
            templateUrl: "/views/modal.html",
            controller: "ModalController",
            preClose: (modal) => { modal.element.modal('hide'); }
            })
            .then(function(modal) {
    
            dataService.getAll('http://server/api/students')
                .then(res => {
                    $rootScope.students = res.data;
                    
                })
            .catch(reject=>console.error(reject));
            modal.element.modal();
            
          });
        
        

    };

}]);

app.factory('dataService',['$http',($http)=>{
        var datas = {};
       return {
        getAll:function(uri){
            return $http.get(
                uri
            );
        },
        getById:function(uri,id){
            return $http.get(
                uri+`/${id}`
            );
        },
        addStudent:(uri,name,age,address,phone)=>{
               return $http.post(uri,
                    {
                        "name":name,
                        "age":age,
                        "address":address,
                        "phone" :phone
                    }
                );
            },
        removeStudent:(uri,index)=>{
            return $http.delete(uri+index);
        },
        setData:(data)=>{
            datas = data;
        },
        getData:()=>{
            return datas;
        }
        

       };
}]);

