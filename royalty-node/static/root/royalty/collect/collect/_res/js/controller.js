var app = angular.module('collectCollect', ['ng-pagination','toastr']);
app.controller('collectCollectCtrl',function($scope,collectSer,toastr) {
    $scope.daySum = function(){
        var vm = $scope;
        vm.sum={
            time:angular.element('.time').val()
        };
        collectSer.dayCollect(vm.sum).then(function(response){

            if(response.data.code == 0){
                $scope.summaryLists = response.data.data;
            }else{
                toastr.error( response.data.msg, '温馨提示');
            }
        })
    };
    $scope.monthSum=function(){
        var vm=$scope;
        vm.month={
            year:vm.year,
            month:vm.month
        };
        collectSer.monthCollect(vm.month).then(function(response){
            if(response.data.code==0){
                $scope.monthLists= response.data.data;
            }else{
                toastr.error( response.data.msg, '温馨提示');
            }
        })
    }
    $scope.totalSum=function(){
        var vm=$scope;
        vm.month={
            time:angular.element('.totaltime').val()
        };
        collectSer.totalCollect(vm.month).then(function(response){
            if(response.data.code==0){
                $scope.totalLists= response.data.data;
            }else{
                toastr.error( response.data.msg, '温馨提示');
            }
        })
    }

    //获取年
    collectSer.yearCollect().then(function (response) {
        if (response.data.code == '0') {
            $scope.years = response.data.data;
        } else {
            toastr.error(response.data.msg, '温馨提示');
        }
    });
    $scope.week=function() {
        var vm = $scope;
        vm.weekList = {
            year:vm.year,
            month: vm.month
        }
        collectSer.findWeek(vm.weekList).then(function (response) {
            if (response.data.code == 0) {
                $scope.weekList = response.data.data;
            } else {
                toastr.error(response.data.msg, '温馨提示');
            }
        })
    }

    $scope.weekSum=function(){
        var vm=$scope;
        vm.month={
            year:vm.year,
            month:vm.month,
            week:vm.week
        };
        collectSer.weekCollect(vm.month).then(function(response){
            if(response.data.code==0){
                $scope.weekLists= response.data.data;
            }else{
                toastr.error( response.data.msg, '温馨提示');
            }
        })
    }
});
app.filter('cos', function(){
    return function (val) {
        var result;
        switch(val) {
            case true:
                result = "是";
                break;
            case false:
                result = "否";
                break;
        }
        return result;
    }
});

app.filter('statusCover',function(){
    return function(val){
        var result;
        switch(val){
            case "BUY":
                result = "购买入库";
                break;
            case "LEND":
                result = "外借入库";
                break;
            case "TRANSFER":
                result = "调动入库";
                break;
        }
        return result;
    }

});
app.filter('Cover',function(){
    return function(val){
        var result;
        switch(val){
            case "INTACT":
                result = "完好";
                break;
            case "MANUAL_DAMAGE":
                result = "人为损坏";
                break;
            case "NATURAL_DAMAGE":
                result = "自然损坏";
                break;
            case "REPAIRING":
                result = "维修中";
                break;
            case "SCRAP":
                result = "已报废";
                break;
        }
        return result;
    }

});

app.filter('Use',function(){
    return function(val){
        var result;
        switch(val){
            case "RECEIVE":
                result = "领用";
                break;
            case "CHECKOUT":
                result = "外借";
                break;
            case "TRANSFER":
                result = "调动";
                break;
            case "INSTOCK":
                result = "在库";
                break;
        }
        return result;
    }

});

/*
var app = angular.module('systemList', ['ng-pagination','toastr']);
app.controller('systemListCtrl',function($scope,systemSer,toastr,$stateParams,$state,$location) {
    $scope.$emit('changeId', null);
    //分页
    $scope.custom = {
        itemsCount: 2, //总条数
        take: 10, //每页显示
        activatePage: activatePage
    };
    $scope.listId=function (id) {
        $scope.popId = id;
        $scope.$emit('fourId',$scope.popId);
    }
    function activatePage(page) {
        if($scope.mailLists) return;
        var listData = {
            page:page||1
        };
        systemSer.accidentList(listData).then(function(response){
            if(response.data.code==0){
                $scope.mailLists = response.data.data;
                if($stateParams.id){
                    if($stateParams.id.indexOf('&')){
                        $stateParams.id = $stateParams.id.split('&')[0];
                    }
                    angular.forEach($scope.mailLists,function(obj){
                        if(obj.id == $stateParams.id){
                            obj._selectList = true;
                        }
                    });
                    //向父Ctrl传递事件
                    $scope.$emit('changeId', $stateParams.id);
                    $scope.$emit('page', $location.search().page);
                }
            }else{
                toastr.error( response.data.msg, '温馨提示');
            }
        });
    }
    $scope.selectList = function(event){
        angular.forEach($scope.mailLists,function(obj){
            obj._selectList = false
        });
        event._selectList = true;
        $scope.idListd = event.id;
        //向父Ctrl传递事件
        $scope.$emit('changeId', $scope.idListd);
        $scope.$emit('page', $location.search().page);

    };
    //查看更多
    $scope.moreList = function (event) {
        angular.forEach($scope.mailLists.data, function (obj) {
            if (event.id !== obj.id) {
                obj._moreList = false
            }
        });
        event._moreList = !event._moreList;
    };
    //获取id
    if($stateParams.id){
        switch ($stateParams.name){
            case 'delete':
                $scope.delShow = true;
                break;
            case 'congeal':
                $scope.congealShow = true;
                break;
        }
    }
    $scope.cancel = function(){//取消删除
        $scope.delShow = false;
        $state.go('root.royalty.systembet.list[12]',{id:null,name:null});
    };
    var count = 0;
    $scope.delFn = function(){//确认删除
        var data = {
            id: $stateParams.id
        };
        systemSer.deleteAccident(data).then(function(response){
            if(response.data.code==0){
                count++;
                toastr.info( "信息已删除", '温馨提示');
                $scope.$emit('fourId', null);
                $scope.delShow = false;
                if(($scope.custom.itemsCount-count)%10){
                    $state.go('root.royalty.systembet.list[12]',{id:null,name:null});
                }else{
                    $state.go('root.royalty.systembet.list[12]',{id:null,name:null,page:$location.search().page-1});
                }
            }else{
                toastr.error( response.data.msg, '温馨提示');
            }
        });
    };

});*/
