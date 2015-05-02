var app = angular.module('clientes', []);
app.controller('controlador', function($scope, $http){

//	------------------------------------------------------------------------------------------------<variables>----------------------------------------------------------------------------------------------

	$scope.opcion = {
		fila_activa : -1
	};

	$scope.buscar = {
		id: "",
		apellido_nombre: "",
		accion: "buscar"
	};

	$scope.modal = {
		titulo : "",
		accion : "",
		boton : "",
		mensaje : "",
		id : "",
		doc_tipo : 1,
		doc_numero : "",
		apellido:"",
		nombre:"",
		telefono:"",
		id_institucion: "",
		cargo:"",
		id_tipo:"",
		sexo: 0,
		email:"",
		id_provincia:"",
		localidad : "",
		calle:""
	};

	var receta1 = { 
            nombre: "Ensalada Caesar",
        }
    var receta2 = {
            nombre: "Tarta de choclo",
        }
    var receta3 = { 
            nombre: "Tarta de Acelga",
        }
    var receta4 = {
            nombre: "Tarta de Atun",
        }
    var receta5 = {
            nombre: "Tarta de Pollo",
    }


    $scope.recetas = [receta1,receta2,receta3,receta4,receta5];


	$scope.provincias = [];
	$scope.instituciones = [];

//	------------------------------------------------------------------------------------------------<funciones>--------------------------------------------------------------------------------------------

	$scope.init = function(){

		$scope.clientes_buscar();

		$http({method: 'POST', url: 'AJAX_provincias_listar.php', data:$scope.provincia })
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

					$scope.provincias = data.datos;
					$scope.modal.id_provincia = $scope.provincias[0];

		})
		.error(function(data, status, headers, config){
			console.log("error");
		});

		$http({method: 'POST', url: 'AJAX_instituciones_listar.php' })
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

					$scope.instituciones = data.datos;
					$scope.modal.id_institucion = $scope.instituciones[0];
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};



	$scope.clientes_buscar = function(){

		$http({method: 'POST', url: 'AJAX_clientes.php',  data:$scope.buscar })
				.success(function(data, status, headers, config){
					var errores = 0;

					for(var i=0; i<data.errores.length; i++){
						console.log(data.errores[i]);
					}
					for(var i=0; i<data.alertas.length; i++){
						console.log(data.alertas[i]);
					}
					for(var i=0; i<data.consulta.length; i++){
						console.log(data.consulta[i]);
					}

					$scope.clientes = data.datos;
				})

		.error(function(data, status, headers, config){
			console.log("error");
		});

		$scope.opcion.fila_activa = -1;
	};



	$scope.cliente_modal = function (modo){

		switch(modo){
			case 1 :	//crear
						$scope.modal.accion		= "agregar";
						$scope.modal.titulo		= "Agregar Cliente";
						$scope.modal.boton		= "guardar";
						$scope.modal.mensaje		= "";
						$scope.modal.id			= "";
						$scope.modal.doc_tipo		= 1;
						$scope.modal.doc_numero	= "";
						$scope.modal.apellido		= "";
						$scope.modal.nombre		= "";
						$scope.modal.telefono		= "";
						$scope.modal.id_institucion	= $scope.instituciones[0];
						$scope.modal.cargo		= "";
						$scope.modal.id_tipo		= "";
						$scope.modal.sexo		= 0;
						$scope.modal.email		= "";
						$scope.modal.id_provincia	= $scope.provincias[0];
						$scope.modal.localidad		= "";
						$scope.modal.calle			= "";
						$('#cliente_modal').modal('show');
						break;
			case 2 :	//modificar
						$scope.modal.accion		= "editar";
						$scope.modal.titulo		= "Editar Cliente";
						$scope.modal.boton		= "guardar cambios";
						$scope.modal.mensaje		= "";
						$scope.modal.doc_tipo		= $scope.clientes[$scope.opcion.fila_activa].doc_tipo;
						$scope.modal.doc_numero	= $scope.clientes[$scope.opcion.fila_activa].doc_numero;
						$scope.modal.apellido		= $scope.clientes[$scope.opcion.fila_activa].apellido;
						$scope.modal.nombre		= $scope.clientes[$scope.opcion.fila_activa].nombre;
						$scope.modal.telefono		= $scope.clientes[$scope.opcion.fila_activa].telefono;
						$scope.modal.id_institucion	= $scope.instituciones[0];

						var id_institucion = $scope.clientes[$scope.opcion.fila_activa].id_institucion;
						for(var i = 0; i<$scope.instituciones.length;i++){
							if($scope.instituciones[i].id == id_institucion){
								$scope.modal.id_institucion = $scope.instituciones[i];
								break;
							}
						}

						$scope.modal.cargo		= $scope.clientes[$scope.opcion.fila_activa].cargo;
						$scope.modal.id_tipo		= $scope.clientes[$scope.opcion.fila_activa].id_tipo;
						$scope.modal.sexo		= $scope.clientes[$scope.opcion.fila_activa].sexo;
						$scope.modal.email		= $scope.clientes[$scope.opcion.fila_activa].email;

						var id_provincia = $scope.clientes[$scope.opcion.fila_activa].id_provincia;
						for(var i = 0; i<$scope.provincias.length;i++){
							if($scope.provincias[i].id == id_provincia){
								$scope.modal.id_provincia = $scope.provincias[i];
								break;
							}
						}

						$scope.modal.localidad		= $scope.clientes[$scope.opcion.fila_activa].localidad;
						$scope.modal.calle			= $scope.clientes[$scope.opcion.fila_activa].calle;
						$('#cliente_modal').modal('show');
						break;
			case 3:	//eliminar
						$scope.modal.accion		= "eliminar";
						$scope.modal.titulo		= "Eliminar Cliente";
						$scope.modal.boton		= "confirmar";
						$scope.modal.apellido		= $scope.clientes[$scope.opcion.fila_activa].apellido;
						$scope.modal.nombre		= $scope.clientes[$scope.opcion.fila_activa].nombre;
						$scope.modal.mensaje		= "¿Desea eliminar el cliente "+$scope.modal.apellido+" "+$scope.modal.nombre+"?";
						$('#cliente_modal').modal('show');
		}
	};



	$scope.cliente_accion = function (){

		$http({method: 'POST', url: 'AJAX_clientes.php', data:$scope.modal })
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
		})
		.error(function(data, status, headers, config){
			console.log("error");
		});

		$scope.clientes_buscar();
	};



	$scope.seleccionar = function(index){
		$scope.opcion.fila_activa	= index;
		$scope.modal.id		= $scope.clientes[$scope.opcion.fila_activa].id;
	};
});