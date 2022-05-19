/**
 * @fileoverview gRPC-Web generated client stub for 
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = require('./order_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.OrderSvcClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.OrderSvcPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.GetAllRequest,
 *   !proto.OrderCollectionResponse>}
 */
const methodDescriptor_OrderSvc_getAll = new grpc.web.MethodDescriptor(
  '/OrderSvc/getAll',
  grpc.web.MethodType.UNARY,
  proto.GetAllRequest,
  proto.OrderCollectionResponse,
  /**
   * @param {!proto.GetAllRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.OrderCollectionResponse.deserializeBinary
);


/**
 * @param {!proto.GetAllRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.OrderCollectionResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.OrderCollectionResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.OrderSvcClient.prototype.getAll =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/OrderSvc/getAll',
      request,
      metadata || {},
      methodDescriptor_OrderSvc_getAll,
      callback);
};


/**
 * @param {!proto.GetAllRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.OrderCollectionResponse>}
 *     Promise that resolves to the response
 */
proto.OrderSvcPromiseClient.prototype.getAll =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/OrderSvc/getAll',
      request,
      metadata || {},
      methodDescriptor_OrderSvc_getAll);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.CreateRequest,
 *   !proto.Order>}
 */
const methodDescriptor_OrderSvc_create = new grpc.web.MethodDescriptor(
  '/OrderSvc/create',
  grpc.web.MethodType.UNARY,
  proto.CreateRequest,
  proto.Order,
  /**
   * @param {!proto.CreateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.Order.deserializeBinary
);


/**
 * @param {!proto.CreateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.Order)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.Order>|undefined}
 *     The XHR Node Readable Stream
 */
proto.OrderSvcClient.prototype.create =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/OrderSvc/create',
      request,
      metadata || {},
      methodDescriptor_OrderSvc_create,
      callback);
};


/**
 * @param {!proto.CreateRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.Order>}
 *     Promise that resolves to the response
 */
proto.OrderSvcPromiseClient.prototype.create =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/OrderSvc/create',
      request,
      metadata || {},
      methodDescriptor_OrderSvc_create);
};


module.exports = proto;

