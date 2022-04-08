import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Enrollment } from '../models/enrollment';
import { EnrollmentsService } from '../../../services/enrollments.service';
import { UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from '../../auth/authorization.guard';
import { CoursesService } from '../../../services/courses.service';
import { StudentsService } from '../../../services/students.service';

@Resolver(() => Enrollment)
export class EnrollmentsResolver {
  constructor(
    private enrolmentsService: EnrollmentsService,
    private coursesService: CoursesService,
    private studentsService: StudentsService,
  ) {}

  @UseGuards(AuthorizationGuard)
  @Query(() => [Enrollment])
  async enrolment() {
    return await this.enrolmentsService.listAllEnrollments();
  }

  @ResolveField()
  async student(@Parent() enrollment: Enrollment) {
    return await this.studentsService.getStudentById(enrollment.studentId);
  }

  @ResolveField()
  async course(@Parent() enrollment: Enrollment) {
    return await this.coursesService.getCourseById(enrollment.courseId);
  }
}
