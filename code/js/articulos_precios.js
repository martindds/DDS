var app = angular.module('articulos_precios', []);

app.controller('articulos_precios', function($scope, $http){
	
	$scope.opcion = {
		filaActiva: -1
	};

	$scope.paneles = {
		buscar: true,
		agregar: false,
		editar: false
	};

	$scope.buscar = {
		id_articulo: "",
		fechaI: "",
		fechaF: ""
	};

	$scope.agregar = {
		id_articulo: "0",
		fechaI: "",
		fechaF: "",
		valor: ""
	};

	$scope.editar = {
		id: "",
		id_articulo: "",
		fechaI: "",
		fechaF: "",
		valor: ""
	};

	$scope.precios = [];

	$scope.articulos = [];

	$scope.init = function(){
    	$http({method: 'POST', url: 'AJAX_articulos_precios_listar.php'})
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

	$scope.check = function(num){
		if(num == $scope.filaActiva){
			return true;
		}
		return false;
	}

	$scope.preciosBuscar = function(){
		
		$http({method: 'POST', url: 'AJAX_articulos_precios_buscar.php', data:$scope.buscar })
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

				$scope.precios = data.datos;
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.preciosAgregar = function(){
		
		$http({method: 'POST', url: 'AJAX_articulos_precios_agregar.php', data:$scope.agregar })
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
					alert("Precio agregado");
				}
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.precioEditar = function(){

		$scope.editar.id_articulo = $("[ng-model='editar.id_articulo']").val();
		
		$http({method: 'POST', url: 'AJAX_articulos_precios_editar.php', data:$scope.editar })
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
					alert("Precio editado");
					$scope.precios[$scope.opcion.filaActiva] = {
						id:$scope.editar.id,
						articulo:$scope.editar.articulo.nombre,
						valor:$scope.editar.valor,
						fechaI:convertirFecha($scope.editar.fechaI),
						fechaF:convertirFecha($scope.editar.fechaF)
					} //Para actualizar el listado

					for(var i=0; i<$scope.articulos.length; i++)
						if($scope.articulos[i].id == $scope.editar.id_articulos)
							$scope.precios[$scope.opcion.filaActiva].articulo = $scope.articulos[i].nombre;
				}
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.precioEliminar = function(){

		var r=confirm("Desea Eliminar el precio selecionado");

		if(r)
		$http({method: 'POST', url: 'AJAX_articulos_precios_eliminar.php', data:$scope.editar })
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
					alert("Precio eliminado");
					$scope.precios.splice($scope.opcion.filaActiva, 1); //Para actualizar el listado
				}
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.accionSeleccionar = function(index){
		var indexArt = retornarIndex($scope.articulos,$scope.precios[index].id_articulo, "id");
		$scope.editar.articulo = $scope.articulos[indexArt];
		$scope.opcion.filaActiva = index;
		$scope.editar.id = $scope.precios[index].id;
		$scope.editar.fechaI = convertirFecha($scope.precios[index].fechaI);
		$scope.editar.fechaF = convertirFecha($scope.precios[index].fechaF);
		$scope.editar.valor = $scope.precios[index].valor;
	};

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


function retornarIndex(lista,valor,elemento){
	for(var i=0; i<lista.length; i++){
		if(lista[i][elemento] == valor)
			return i;
	}
}

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