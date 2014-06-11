/**
 * Created by Adam on 1/6/14.
 */

var toDoApp = angular.module('toDoApp', ['firebase']);

toDoApp.service('myService', [  "$firebase", function ($firebase) {
    //
    var url = 'https://iscrying.firebaseio.com';

    this.getList = function (path) {
        var ref = new Firebase(url + '/' + path);
        console.log(ref);
        return $firebase(ref);
    };
    this.addItem = function (newItem) {
        var ref = new Firebase(url + '/items/' + newItem.id);
        ref.set(newItem);

    };
    this.deleteItem = function (id) {
        var ref = new Firebase(url + '/items/' + id);
        ref.remove();
    };
    this.addCategory = function (newCategory) {
        var ref = new Firebase(url + '/category/' + newCategory.id);
        ref.set(newCategory);
    };
    this.updateTab = function (c) {
        var ref = new Firebase(url + '/tab/');
        ref.set(c);

    };
}]);


toDoApp.controller('itemController', function ($scope, myService) {
    $scope.loaded = false;
    $scope.tab = myService.getList('tab');
    $scope.items = myService.getList('items');
    $scope.categories = myService.getList('category');


    $scope.item = '';
    $scope.category = '';

    $scope.ofCategory = function (tab) {
        return function (item) {
            return item.category == tab;
        }
    };

    $scope.newActive = function (item) {
        $scope.tab = item.category;
        myService.updateTab(item.category);
        // Refresh Table?
    };
    $scope.changeCompleted = function (items) {
        // Update the item
        $scope.items.$child(item.id).$set(item);
        $scope.item.completed = true;
        var message = (item.completed === true) ? 'Task Completed!' : 'Task Uncompleted!';
    };

    $scope.removeCompletedItems = function () {
        // If a item is completed, delete it
        $scope.items.$getIndex().forEach(function (index) {
            if ($scope.items[index].completed === true) {
                myService.deleteItem(index);
            }
        });
    };

    $scope.addTask = function (item) {
        item.id = generateID();
        myService.addItem(item);


        var existingCat = false;
        $scope.categories.$getIndex().forEach(function (index) {
            if ($scope.categories[index].category === item.category) {
                existingCat = true;
            }
        });

        if (existingCat == false) {
            console.log("pig");
            $scope.category.category = item.category;
            $scope.addCategory($scope.category);
        }

        $scope.item = '';
    };

    $scope.addCategory = function (category) {
        category.id = generateID();
        myService.addCategory(category);
        $scope.category = '';
    }

    // Random ID generator
    function generateID() {
        var chars, x, length = 10;
        chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-=";
        var name = [];
        for (x = 0; x < length; x++) {
            name.push(chars[Math.floor(Math.random() * chars.length)]);
        }
        var id = name.join('');
        if ($scope.items.$getIndex().indexOf(id) === -1) {
            return id;
        } else {
            generateID();
        }
    };


});


toDoApp.filter('toArray', function () {
    return function (input) {
        var out = [0];
        for (i in input) {
            out.push(input[i]);
        }
        return out;
    }
});