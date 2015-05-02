var app = angular.module('buscador', []);

app.controller('busqueda', function($scope, $http, $location){
	$scope.cotizacion_detalle = {};

	$scope.panel = {
		fecha_cotizado:{
			desde:"",
			hasta:""
		},
		fecha_viaje:{
			desde:"",
			hasta:""
		},
		categoria:"",
		ordenar:{
			campo:"id",
			direccion:1
		}
	};

	$scope.categorias = [
		{ id: 0, nombre:"Todas" },
		{ id: 1, nombre:"Semicama" },
		{ id: 2, nombre:"Semicama-Ejecutivo" },
		{ id: 3, nombre:"Ejecutivo-Cama" },
		{ id: 4, nombre:"Suite" }
	];

	$scope.cotizaciones = [];

	$scope.opciones = {
		filaActiva:-1
	}

	$scope.init = function(){
		$scope.cargarCategorias();	
	};

	$scope.cargarCategorias = function(){
		$http({method: 'POST', url: 'AJAX_categorias_listar.php'})
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

				$scope.categorias = data.datos;

				$scope.categorias.splice(0,0,{ id: 0, nombre:"Todas" });

				$scope.panel.categoria = $scope.categorias[0];
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.cotizaciones_buscar = function(){

		var datos = $scope.panel;

		$http({method: 'POST', url: 'AJAX_cotizacion_buscar.php', data: datos})
			.success(function(data, status, headers, config){
				for(var i=0; i<data.errores.length; i++){
					console.log(data.errores[i]);
				}
				for(var i=0; i<data.alertas.length; i++){
					console.log(data.alertas[i]);
				}
				if(data.consulta != ""){
					console.log(data.consulta);
				}

				$scope.cotizaciones = data.datos;
				$scope.opciones.filaActiva = -1;
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.ordenar = function(campo){
		if(campo == $scope.panel.ordenar.campo){
			$scope.panel.ordenar.direccion *= -1;
		}
		else{
			$scope.panel.ordenar.campo = campo;
			$scope.panel.ordenar.direccion = 1;
		}
		$scope.cotizaciones_buscar();
	};

	$scope.cotizacion_cargar_detalle = function(){
		var datos = {
			id: $scope.cotizaciones[$scope.opciones.filaActiva].id
		}

		$http({method: 'POST', url: 'AJAX_cotizacion_detalle.php', data: datos})
			.success(function(data, status, headers, config){
				for(var i=0; i<data.errores.length; i++){
					console.log(data.errores[i]);
				}
				for(var i=0; i<data.alertas.length; i++){
					console.log(data.alertas[i]);
				}
				if(data.consulta != ""){
					console.log(data.consulta);
				}

				$scope.cotizacion_detalle = data.datos;
				console.log($scope.cotizacion_detalle);
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.stringTipoKm  = function(valor){
		if(valor == "2")
			return "Km vacios";
		else
			return "Km"
	};

	$scope.vista_de_impresion = function(){
		window.open('cotizacion_para_cliente.php?id='+$scope.cotizaciones[$scope.opciones.filaActiva].id);
	}

});

app.directive('datepicker', function() {
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