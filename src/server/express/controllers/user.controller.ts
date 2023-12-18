import { Request, Response } from 'express';
import { UserService } from '../domain/user.service';
import { AddUserDto, UserPaginationQuery } from '../types/user/input';
import { IUser } from '../types/user/output';
import { Nullable } from '../common/interfaces/optional.types';
import { ApiResponse } from '../common/api-response/api-response';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { createFilterGetAllUsersMapper } from '../mappers/user.mapper';
import { QueryUserRepository } from '../repositories/user/query-user.repository';

class UserController {
    // async getAllBlogs(req: Request<{}, {}, {}, BlogQueryTypeOptional>, res: Response, next: NextFunction) {
    //     const query: BlogQuery = blogGetAllQueryMapper(req.query);
    //     const blogs: Optional<IBlogModelOut> = await QueryBlogRepository.findAll(query);
    //
    //     new ApiResponse(res).send(HttpStatusCodes.OK, blogs);
    // }
    //
    // async getBlogById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    //     const id = req.params.id;
    //     const blog: Nullable<IBlogModel> = await QueryBlogRepository.findById(id);
    //
    //     blog ? new ApiResponse(res).send(HttpStatusCodes.OK, blog) : new ApiResponse(res).notFound();
    // }

    /**
     * create user like a supper admin
     */
    async createUser(req: Request<{}, {}, AddUserDto>, res: Response) {
        const newUser: Nullable<IUser> = await UserService.create(req.body);
        const response = new ApiResponse(res);

        newUser ? response.send(HttpStatusCodes.CREATED, newUser) : response.badRequest();
    }

    async removeById(req: Request<{ id: string }>, res: Response) {
        const isRemoved: boolean = await UserService.removeById(req.params.id);
        const response = new ApiResponse(res);

        isRemoved ? response.send(HttpStatusCodes.NO_CONTENT) : response.notFound();
    }

    async getAll(req: Request<{}, {}, {}, {}>, res: Response) {
        const query: UserPaginationQuery = createFilterGetAllUsersMapper(req.query);
        const pageWithUsers = await QueryUserRepository.findAll(query);
        new ApiResponse(res).send(HttpStatusCodes.OK, pageWithUsers);
    }
    // async updateBlogById(req: Request<{ id: string }, {}, UpdateBlogDto>, res: Response, next: NextFunction) {
    //     const isUpdated: boolean = await BlogService.updateById(req.params.id, req.body);
    //     const response = new ApiResponse(res);
    //     isUpdated ? response.send(HttpStatusCodes.NO_CONTENT) : response.notFound();
    // }

    // async removeBlogById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    //     const isRemoved: boolean = await BlogService.removeById(req.params.id);
    //     const response = new ApiResponse(res);
    //     isRemoved ? response.send(HttpStatusCodes.NO_CONTENT) : response.notFound();
    // }

    // async createPostToBlog(req: Request<{ id: string }, {}, IPostToBlogDto>, res: Response, next: NextFunction) {
    //     const id = req.params.id;
    //
    //     const createdPost: Nullable<IPostModel> = await BlogService.createPostToBlog(id, req.body);
    //     const response = new ApiResponse(res);
    //     createdPost ? response.send(HttpStatusCodes.CREATED, createdPost) : response.notFound();
    // }
    //
    // async getAllPostsByBlogId(req: Request<{ id: string }, {}, {}, PostsByBlogQueryOptional>, res: Response) {
    //     const blogId = req.params.id;
    //     const query: PostsByBlogQuery = postsGetAllQueryMapper(req.query);
    //
    //     const blogWithPosts: Nullable<IPostModelOut> = await QueryPostRepository.findAllPostsByBlogId(blogId, query);
    //
    //     const response = new ApiResponse(res);
    //     blogWithPosts ? response.send(HttpStatusCodes.OK, blogWithPosts) : response.notFound();
    // }
}

export const userController = new UserController();
