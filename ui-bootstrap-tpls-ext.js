angular.module("ui.bootstrap.ext", ["ui.bootstrap", "ui.bootstrap.ext.tpls", "ui.bootstrap.ext.popover"]);
angular.module("ui.bootstrap.ext.tpls", ["template/popover/popover-template.html"]);

angular.module("ui.bootstrap.ext.popover", ["ui.bootstrap.popover"])
    .directive( 'popoverTemplatePopup', [ '$http', '$templateCache', '$compile', '$timeout', function ( $http, $templateCache, $compile, $timeout ) {
      return {
        restrict: 'EA',
        replace: true,
        scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&', compileScope: '&' },
        templateUrl: 'template/popover/popover-template.html',
        link: function( scope, iElement ) {
          scope.$watch( 'content', function( templateUrl ) {
            if ( !templateUrl ) { return; }
            $http.get( templateUrl, { cache: $templateCache } )
                .then( function( response ) {
                  var contentEl = angular.element( iElement[0].querySelector( '.popover-content' ) );
                  contentEl.children().remove();
                  contentEl.append( $compile( response.data.trim() )( scope.$parent ) );
                  $timeout(function(){ scope.$parent.$digest(); });
                });
          });
        }
      };
    }])
    .directive( 'popoverTemplate', [ '$tooltip', function ( $tooltip ) {
        return $tooltip( 'popoverTemplate', 'popover', 'click' );
    }])
    .directive('popoverTemplateDeclaration', ['$templateCache', function($templateCache) {
        return {
            restrict: 'E',
            transclude: false,
            scope: { templateId: '@' },
            compile: function(element) {
                var html = element.html();
                return function(scope, element) {
                    element.hide();
                    $templateCache.put(scope.templateId, html);
                }
            }
        };
    }]);

angular.module("template/popover/popover-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/popover/popover-template.html",
    "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
    "  <div class=\"arrow\"></div>\n" +
    "\n" +
    "  <div class=\"popover-inner\">\n" +
    "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-show=\"title\"></h3>\n" +
    "      <div class=\"popover-content\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);