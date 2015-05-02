var app = angular.module('clientes', []);
app.controller('controlador', function($scope, $http){

// variables----------------------------------------------------------------------------

	$scope.buscar = {
		nombre : null
	}

	$scope.opcion = {
		receta_activa : -1,
		receta_seleccionada : -1,
		comida_activa : -1
	};

	$scope.comida_tipo_seleccionadas = {
		desayuno : false,
		almuerzo : false,
		merienda : false,
		cena : false
	};	


	$scope.recetas = [];	
	//Hardcodeo-----------------------------------------------------------------

	$scope.recetas = [
	    { id : 1, nombre: "Ensalada Caesar" },
		{ id : 2, nombre: "Tarta de choclo" },
		{ id : 3, nombre: "Tarta de Acelga" },
		{ id : 4, nombre: "Tarta de Atun"  },
		{ id : 5, nombre: "Tarta de Pollo"  },
		{ id : 6, nombre: "Toritlla de Papas"  },
		{ id : 7, nombre: "Fideos con Crema"  },
		{ id : 8, nombre: "Fideos con Salsa Blanca"  },
		{ id : 9, nombre: "Arroz con Pollo"  },
		{ id : 10, nombre: "Cafe con leche"  },
		{ id : 11, nombre: "Sopa de calabazas"  }
	];




    var desayuno = {
    	id : 1,
    	nombre : "desayuno",
    	receta : null
    };

    var almuerzo = {
    	id : 2,
    	nombre : "almuerzo",
    	receta : null
    };

    var merienda = {
    	id : 3,
    	nombre : "merienda",
    	receta : null
    };

    var cena = {
    	id : 4,
    	nombre : "cena",
    	receta : null
    };

	$scope.comidas = [desayuno,almuerzo,merienda,cena];
	//Hardcodeo-----------------------------------------------------------------



// functions----------------------------------------------------------------------------

	$scope.seleccionar_receta = function(index,receta_id){
		$scope.opcion.receta_activa	= index;
		$scope.opcion.receta_seleccionada	= receta_id;

	};

	$scope.seleccionar_comida = function(index){
		$scope.opcion.comida_activa	= index;
	};

	$scope.agregar_comida = function(){

		var arr = [];
		arr[1] = 'chau';
		arr[2] = 'hola';
		 
		for (var ele in arr) {
		    alert(ele);
		}
return;
		var receta_seleccionada_id = $scope.opcion.receta_seleccionada;
		var receta_seleccionada_nombre;

		//reseteo el checkbox
		$scope.comida_tipo_seleccionadas.desayuno = false;
		$scope.comida_tipo_seleccionadas.almuerzo = false;
		$scope.comida_tipo_seleccionadas.merienda = false;
		$scope.comida_tipo_seleccionadas.cena = false;

		//busco el indice del array donde se encentra el id seleccionado
		for (var receta in $scope.recetas) {
			alert(receta.id+"primera");
		   if (receta.id == receta_seleccionada_id) {
		   	alert(receta_seleccionada_id+"entre");
		   		receta_seleccionada_nombre = receta.nombre;
		   		break;
		   }
		}

		if ($scope.comida_tipo_seleccionadas.desayuno) {

			$scope.comidas[0].receta = receta_seleccionada_nombre;
		}
		if ($scope.comida_tipo_seleccionadas.almuerzo) {
			$scope.comidas[1].receta = receta_seleccionada_nombre;
		}
		if ($scope.comida_tipo_seleccionadas.merienda) {
			$scope.comidas[2].receta = receta_seleccionada_nombre;
		}
		if ($scope.comida_tipo_seleccionadas.cena) {
			$scope.comidas[3].receta = receta_seleccionada_nombre;
		}

	};
});