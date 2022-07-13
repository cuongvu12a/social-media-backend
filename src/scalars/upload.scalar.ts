import { Scalar, CustomScalar } from '@nestjs/graphql'
import { FileUpload } from 'graphql-upload'
import GraphQLUpload = require('graphql-upload/GraphQLUpload.js')

@Scalar('Upload')
export class UploadScalar implements CustomScalar<object, string> {
	description = 'Upload custom scalar type'

	parseValue(value: Promise<FileUpload>): any {
		return GraphQLUpload.parseValue(value)
	}

	serialize(value: any): any {
		return GraphQLUpload.serialize(value)
	}

	parseLiteral(ast: any): any {
		return GraphQLUpload.parseLiteral(ast, ast.value)
	}
}
