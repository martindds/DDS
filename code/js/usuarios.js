
var app = angular.module('usuarios', []);

app.controller('controlador', function($scope, $http){

//	------------------------------------------------------------------------------------------------<variables>----------------------------------------------------------------------------------------------

	$scope.opcion = {
		fila_activa_usu : -1,
		fila_activa_permiso_asc: -1,
		fila_activa_permiso_disp: -1
	};

	$scope.flags = {
		resetear_clave : 0,
		permisos_cambios_realizados : false
	};

	$scope.buscar = {
		usuario: "",
		apellido_nombre: "",
		accion: "buscar"
	};

	$scope.modal_usuario = {
		id : "",
		usuario: "",
		usuario_anterior: "",
		clave: "",
		id_persona : "",
		doc_tipo : "1",
		doc_numero : "",
		apellido : "",
		nombre : "",
		id_grupo: "",
		telefono: "",
		email: "",
		accion: ""
	};

	$scope.permisos_accion ={
		id_usuario : "",
		accion : ""
	};

	$scope.modal = {
		titulo : "",
		mensaje: "",
		boton : ""
	};

	$scope.permiso_agregado = "0";
	$scope.permiso_quitado = "0";

	$scope.usuarios = [];
	$scope.permisos_asignados = [];
	$scope.permisos_disponibles = [];
	$scope.usuarios_grupos = [];

//	-----------------------------------------------------------------------------------------------</variables>----------------------------------------------------------------------------------------------
	$scope.check = function(num){
		if(num == $scope.fila_activa){
			return true;
		}
		return false;
	};
//	-----------------------------------------------------------------------------------------------<Usuarios>----------------------------------------------------------------------------------------------

	$scope.init = function() {
		$http({method: 'POST', url: 'AJAX_usuarios_grupos.php' })
				.success(function(data, status, headers, config){

					for(var i=0; i<data.errores.length; i++){
						console.log(data.errores[i]);
					}
					for(var i=0; i<data.alertas.length; i++){
						console.log(data.alertas[i]);
					}

					$scope.usuarios_grupos = data.datos;
				})

		.error(function(data, status, headers, config){
			console.log("error");
		});
		
		$scope.usuarios_buscar();
	};


	$scope.usuarios_buscar = function(){

		$http({method: 'POST', url: 'AJAX_usuarios.php',  data:$scope.buscar })
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

					$scope.usuarios = data.datos;
				})

		.error(function(data, status, headers, config){
			console.log("error");
		});

		$scope.opcion.fila_activa_usu = -1;
	};


	$scope.usuarios_accion = function(){

		$http({method: 'POST', url: 'AJAX_usuarios.php', data:$scope.modal_usuario })
			.success(function(data, status, headers, config){
				var errores = 0;
				var alertas = 0;

				for(var i=0; i<data.errores.length; i++){
					console.log(data.errores[i]);
					$scope.modal.mensaje = data.errores[i];
					errores++;
				}

				for(var i=0; i<data.alertas.length; i++){
					console.log(data.alertas[i]);
					$scope.modal.mensaje = data.alertas[i];
					alertas++;
				}

				if(data.consulta != ""){
					console.log(data.consulta);
				}

				if($scope.modal.mensaje != ""){
					$("#mensaje_modal").modal("show");
					$scope.usuarios_buscar();
				}
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.usuarios_modal = function(opcion){

		switch(opcion){
			case 1 :	$scope.modal.titulo				= "Agregar Usuario";
					$scope.modal.boton				= "Guardar";
					$scope.modal.mensaje				= "";

					$scope.modal_usuario.usuario			= "";
					$scope.modal_usuario.usuario_anterior	= "";
					$scope.modal_usuario.clave			= "";
					$scope.modal_usuario.doc_tipo			= "1";
					$scope.modal_usuario.doc_numero		= "";
					$scope.modal_usuario.apellido			= "";
					$scope.modal_usuario.nombre			= "";
					$scope.modal_usuario.id_grupo			= $scope.usuarios_grupos[0];
					$scope.modal_usuario.telefono			= "";
					$scope.modal_usuario.email			= "";
					$scope.modal_usuario.accion			= "agregar";
					break;

			case 2 :	$scope.modal.titulo				= "Editar Usuario";
					$scope.modal.boton				= "Guardar Cambios";
					$scope.modal.mensaje				= "";
					$scope.flags.resetear_clave			= 0;

					var id_grupo;

					for(var i = 0;i<$scope.usuarios_grupos.length;i++){
						if($scope.usuarios[$scope.opcion.fila_activa_usu].id_grupo == $scope.usuarios_grupos[i].id){
							id_grupo = i;
							break;
						}
					}

					$scope.modal_usuario.usuario			= $scope.usuarios[$scope.opcion.fila_activa_usu].usuario;
					$scope.modal_usuario.usuario_anterior	= $scope.usuarios[$scope.opcion.fila_activa_usu].usuario;
					$scope.modal_usuario.clave			= "";
					$scope.modal_usuario.doc_tipo			= $scope.usuarios[$scope.opcion.fila_activa_usu].doc_tipo;
					$scope.modal_usuario.doc_numero		= $scope.usuarios[$scope.opcion.fila_activa_usu].doc_numero;
					$scope.modal_usuario.apellido			= $scope.usuarios[$scope.opcion.fila_activa_usu].apellido;
					$scope.modal_usuario.nombre			= $scope.usuarios[$scope.opcion.fila_activa_usu].nombre;
					$scope.modal_usuario.id_grupo			= $scope.usuarios_grupos[id_grupo];
					$scope.modal_usuario.telefono			= $scope.usuarios[$scope.opcion.fila_activa_usu].telefono;
					$scope.modal_usuario.email			= $scope.usuarios[$scope.opcion.fila_activa_usu].email;
					$scope.modal_usuario.accion			= "editar";
					break;

			case 3:	$scope.modal.titulo				= "Eliminar Usuario";
					$scope.modal.boton				= "Confirmar";
					$scope.modal.mensaje				= "¿Confirma que desea eliminar el usuario "+$scope.usuarios[$scope.opcion.fila_activa_usu].usuario+"?";
					$scope.modal_usuario.accion			= "eliminar";
					break;
		}

		$("#usuario_modal").modal("show");
	};

//	-----------------------------------------------------------------------------------------------<Permisos>----------------------------------------------------------------------------------------------
	$scope.permisos_buscar = function(){

		$scope.permisos_accion.accion = "buscar";
		$scope.permisos_accion.id_usuario =  $scope.modal_usuario.id;

		$http({method: 'POST', url: 'AJAX_permisos.php',  data:$scope.permisos_accion })
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

					$scope.permisos_asignados	= [];
					$scope.permisos_disponibles	= [];

					for(var i =0;i < data.datos.length;i++){
						if(data.datos[i].asignado == 1){
							$scope.permisos_asignados.push(data.datos[i]);
						}
						else{
							$scope.permisos_disponibles.push(data.datos[i]);
						}
					}

				})

		.error(function(data, status, headers, config){
			console.log("error");
		});

		$scope.opcion.fila_activa_permiso= -1;
	};


	$scope.permisos_agregar = function(){

		if($scope.permisos_disponibles != 0 &&  $scope.permiso_agregado != 0){
			$scope.permisos_cambios_realizados = true; 
			var id = $scope.permiso_agregado;

			for(var i = 0;i<$scope.permisos_disponibles.length;i++){
				if($scope.permisos_disponibles[i]["id"] == id){
					break;
				}
			}

			var elemento = $scope.permisos_disponibles[i];

			$scope.permisos_disponibles.splice(i,1);
			$scope.permisos_asignados.push(elemento);
		}
	};


	$scope.permisos_quitar = function(){

		if($scope.permisos_asignados != 0 &&  $scope.permiso_quitado != 0){
			$scope.permisos_cambios_realizados = true;
			var id = $scope.permiso_quitado;

			for(var i = 0;i<$scope.permisos_asignados.length;i++){
				if($scope.permisos_asignados[i]["id"] == id){
					break;
				}
			}

			var elemento = $scope.permisos_asignados[i];

			$scope.permisos_asignados.splice(i,1);
			$scope.permisos_disponibles.push(elemento);
		}
	};

	$scope.permisos_editar = function(){

		var datos = {
			id_usuario : $scope.permisos_accion.id_usuario,
			accion: "editar",
			permisos_asignados : $scope.permisos_asignados,
			permisos_disponibles : $scope.permisos_disponibles
		};

		$http({method: 'POST', url: 'AJAX_permisos.php',  data:datos })
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
	};

//	-----------------------------------------------------------------------------------------------</Permisos>----------------------------------------------------------------------------------------------

	$scope.seleccionar_usuario = function(index){

		$scope.opcion.fila_activa_usu = index;
		$scope.modal_usuario.id	= $scope.usuarios[index].id;

		$scope.permisos_buscar();
	};

	$scope.seleccionar_permiso_asc = function(index){
		$scope.opcion.fila_activa_permiso_asc = index;
	};

	$scope.seleccionar_permiso_disp = function(index){
		$scope.opcion.fila_activa_permiso_disp = index;
	};



	$scope.buscar_persona = function() {

		if($scope.modal_usuario.doc_numero != ""){

			$http({method: 'POST', url: 'AJAX_persona_buscar.php', data:$scope.modal_usuario })
				.success(function(data, status, headers, config){
					var errores = 0;

					for(var i=0; i<data.errores.length; i++){
						console.log(data.errores[i]);
						errores++;
					}

					for(var i=0; i<data.alertas.length; i++){
						console.log(data.alertas[i]);
						errores++;
					}

					if(data["datos"].length != 0){

						$scope.modal_usuario.apellido	= data["datos"][0].apellido;
						$scope.modal_usuario.nombre	= data["datos"][0].nombre;
						$scope.modal_usuario.telefono	= data["datos"][0].telefono;
						$scope.modal_usuario.email	= data["datos"][0].email;
					}

					else{
						$scope.modal_usuario.apellido	= "";
						$scope.modal_usuario.nombre	= "";
						$scope.modal_usuario.telefono	= "";
						$scope.modal_usuario.email	= "";
					}
			})

			.error(function(data, status, headers, config){
				console.log("error");
			});
		}
	};
	
	$scope.resetear_clave = function() {
		$scope.flags.resetear_clave = 1;
	};

});





app.directive('ngBlur', function() {
	return function( scope, elem, attrs ) {
		elem.bind('blur', function() {
			scope.$apply(attrs.ngBlur);
		});
	};
});