var app = angular.module('tarifas', []);

app.controller('tarifas', function($scope, $http){
	
	$scope.opcion = {
		filaActiva: -1
	};

	$scope.paneles = {
		buscar: true,
		agregar: false,
		editar: false
	};

	$scope.buscar = {
		id_tipo: "",
		fechaI: "",
		fechaF: ""
	};

	$scope.agregar = {
		id_tipo: "",
		fechaI: "",
		fechaF: "",
		valor: ""
	};

	$scope.editar = {
		id: "",
		id_tipo: "",
		fechaI: "",
		fechaF: "",
		valor: ""
	};

	$scope.tarifas = [];

	$scope.tipos = [];

	$scope.init = function(){
    	$http({method: 'POST', url: 'AJAX_tarifa_tipo_listar.php'})
			.success(function(data, status, headers, config){
				for(var i=0; i<data.errores.length; i++){
					console.log(data.errores[i]);
				}
				for(var i=0; i<data.alertas.length; i++){
					console.log(data.alertas[i]);
				}
				for(var i=0; i<data.consulta.length; i++){
					console.log(data.consulta[i]);
				}
				
				$scope.tipos = data.datos;
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.check = function(num){
		if(num == $scope.filaActiva){
			return true;
		}
		return false;
	};

	$scope.tarifaBuscar = function(){
		
		$http({method: 'POST', url: 'AJAX_tarifa_buscar.php', data:$scope.buscar })
			.success(function(data, status, headers, config){

				for(var i=0; i<data.errores.length; i++){
					console.log(data.errores[i]);
				}
				for(var i=0; i<data.alertas.length; i++){
					console.log(data.alertas[i]);
				}
				for(var i=0; i<data.consulta.length; i++){
					console.log(data.consulta[i]);
				}

				$scope.tarifas = data.datos;
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.tarifaAgregar = function(){
		
		$http({method: 'POST', url: 'AJAX_tarifa_agregar.php', data:$scope.agregar })
			.success(function(data, status, headers, config){
				var errores = 0;

				for(var i=0; i<data.errores.length; i++){
					console.log(data.errores[i]);
					alert(data.errores[i]);
					errores++;
				}

				for(var i=0; i<data.alertas.length; i++){
					console.log(data.alertas[i]);
					alert(data.alertas[i]);
					errores++;
				}

				if(data.consulta != ""){
					console.log(data.consulta);
				}

				if(!errores){
					alert("Tarifa agregada");
				}
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.tarifaEditar = function(){

		$scope.editar.id_tipo = $("[ng-model='editar.id_tipo']").val();
		
		$http({method: 'POST', url: 'AJAX_tarifa_editar.php', data:$scope.editar })
			.success(function(data, status, headers, config){
				var errores = 0;

				for(var i=0; i<data.errores.length; i++){
					console.log(data.errores[i]);
					alert(data.errores[i]);
					errores++;
				}

				for(var i=0; i<data.alertas.length; i++){
					console.log(data.alertas[i]);
					alert(data.alertas[i]);
					errores++;
				}

				if(data.consulta != ""){
					console.log(data.consulta);
				}

				if(!errores){
					alert("Tarifa editada");
					$scope.tarifas[$scope.opcion.filaActiva] = $scope.editar; //Para actualizar el listado
					for(var i=0; i<$scope.tipos.length; i++)
						if($scope.tipos[i].id == $scope.editar.id_tipo)
							$scope.tarifas[$scope.opcion.filaActiva].tipo = $scope.tipos[i].nombre;
				}
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.tarifaEliminar = function(){

		var r=confirm("Desea Eliminar la tarifa selecionada");

		if(r)
		$http({method: 'POST', url: 'AJAX_tarifa_eliminar.php', data:$scope.editar })
			.success(function(data, status, headers, config){
				var errores = 0;

				for(var i=0; i<data.errores.length; i++){
					console.log(data.errores[i]);
					alert(data.errores[i]);
					errores++;
				}

				for(var i=0; i<data.alertas.length; i++){
					console.log(data.alertas[i]);
					alert(data.alertas[i]);
					errores++;
				}

				if(data.consulta != ""){
					console.log(data.consulta);
				}

				if(!errores){
					alert("Tarifa eliminada");
					$scope.tarifas.splice($scope.opcion.filaActiva, 1); //Para actualizar el listado
				}
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.accionSeleccionar = function(index){
		$scope.opcion.filaActiva = index;
		$scope.editar.id = $scope.tarifas[index].id;
		$("[ng-model='editar.id_tipo']").val($scope.tarifas[index].id_tipo);
		$scope.editar.fechaI = convertirFecha($scope.tarifas[index].fechaI);
		$scope.editar.fechaF = convertirFecha($scope.tarifas[index].fechaF);
		$scope.editar.valor = $scope.tarifas[index].valor;
	};

	//$scope.$watch("opcion", function(){ $scope.accionSeleccionar($scope.opcion.filaActiva);}, true);
});

app.directive('datepicker', function(){
	return {
		restrict: 'A',
		require : 'ngModel',
		link : function (scope, element, attrs, ngModelCtrl) {
			$(function(){
				element.datepicker({
					dateFormat:'yy-mm-dd',
					onSelect:function (fecha) {
						ngModelCtrl.$setViewValue(fecha);
						scope.$apply();
					}
				});
			});
		}
	};
});


function convertirFecha(dato){
	dato = dato.replace(/^\s+|\s+$/g, '');
	var hora = "";

	if( dato.indexOf(" ") !== -1 && dato.length > "12" ){
		var n = dato.split(" ");
		dato = n[0];
		hora = " "+n[1];

	}
	if( dato.indexOf("/") === -1 ){
		var n = dato.split("-");
		var año = n[0];
		var mes = n[1];
		var dia = n[2];
		return dia+"/"+mes+"/"+año+hora;
	}
	else{
		var n = dato.split("/");
		var dia = n[0];
		var mes = n[1];
		var año = n[2];

		return año+"-"+mes+"-"+dia+hora;
	}
}