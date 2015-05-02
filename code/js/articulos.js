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
		nombre: "",
	};

	$scope.agregar = {
		nombre: "",
		detalle: ""
	};

	$scope.editar = {
		nombre: "",
		detalle: "",
		id: ""
	};

	$scope.articulos = [];


	$scope.articulosBuscar = function(){
		
		$http({method: 'POST', url: 'AJAX_articulos_buscar.php', data:$scope.buscar })
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

				$scope.articulos = data.datos;
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.articuloAgregar = function(){
		
		$http({method: 'POST', url: 'AJAX_articulo_agregar.php', data:$scope.agregar })
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
					alert("Articulo agregado");
				}
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.articuloEditar = function(){

		$http({method: 'POST', url: 'AJAX_articulo_editar.php', data:$scope.editar })
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
					alert("Articulo editado");
					$scope.articulos[$scope.opcion.filaActiva] = {
						id:$scope.editar.id,
						nombre:$scope.editar.nombre,
						detalle:$scope.editar.detalle
					} //Para actualizar el listado
				}
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.articuloEliminar = function(){

		var r=confirm("Desea eliminar el articulo selecionado");

		if(r)
		$http({method: 'POST', url: 'AJAX_articulo_eliminar.php', data:$scope.editar })
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
					alert("Articulo eliminado");
					$scope.articulos.splice($scope.opcion.filaActiva, 1); //Para actualizar el listado
				}
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.accionSeleccionar = function(index){
		$scope.opcion.filaActiva = index;
		$scope.editar.id = $scope.articulos[index].id;
		$scope.editar.nombre = $scope.articulos[index].nombre;
		$scope.editar.detalle = $scope.articulos[index].detalle;
		
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