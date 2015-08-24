from django.core.urlresolvers import reverse

from utils.views import (BaseDetail, BaseDelete,
                         BaseVersion, BaseUpdate, BaseCreate,
                         BaseCreateWithFormset, BaseUpdateWithFormset,
                         CloseIfSuccessMixin, BaseList, GenerateReport)

from assessment.models import Assessment
from study.models import Study

from . import forms, models


# Study criteria
class StudyCriteriaCreate(CloseIfSuccessMixin, BaseCreate):
    success_message = 'Criteria created.'
    parent_model = Assessment
    parent_template_name = 'assessment'
    model = models.Criteria
    form_class = forms.CriteriaForm


# Study population
class StudyPopulationCreate(BaseCreate):
    success_message = 'Study-population created.'
    parent_model = Study
    parent_template_name = 'study'
    model = models.StudyPopulation
    form_class = forms.StudyPopulationForm


class StudyPopulationDetail(BaseDetail):
    model = models.StudyPopulation


class StudyPopulationUpdate(BaseUpdate):
    success_message = "Study Population updated."
    model = models.StudyPopulation
    form_class = forms.StudyPopulationForm


class StudyPopulationDelete(BaseDelete):
    success_message = "Study Population deleted."
    model = models.StudyPopulation

    def get_success_url(self):
        self.parent = self.object.study
        return reverse("study:detail", kwargs={"pk": self.parent.pk})


# Factors
class AdjustmentFactorCreate(CloseIfSuccessMixin, BaseCreate):
    success_message = 'Adjustment factor created.'
    parent_model = Assessment
    parent_template_name = 'assessment'
    model = models.AdjustmentFactor
    form_class = forms.AdjustmentFactorForm


# Outcome
class OutcomeCreate(BaseCreateWithFormset):
    success_message = 'Outcome created.'
    parent_model = models.StudyPopulation
    parent_template_name = 'study_population'
    model = models.Outcome
    form_class = forms.OutcomeForm
    formset_factory = forms.ResultMeasurementFormset

    def get_form_kwargs(self):
        kwargs = super(OutcomeCreate, self).get_form_kwargs()
        kwargs['assessment'] = self.assessment
        return kwargs

    def post_object_save(self, form, formset):
        for form in formset.forms:
            form.instance.outcome = self.object

    def build_initial_formset_factory(self):
        return forms.BlankResultMeasurementFormset(
            queryset=models.ResultMeasurement.objects.none(),
            assessment=self.assessment)


class OutcomeDetail(BaseDetail):
    model = models.Outcome


class OutcomeUpdate(BaseUpdateWithFormset):
    success_message = "Outcome updated."
    model = models.Outcome
    form_class = forms.OutcomeForm
    formset_factory = forms.ResultMeasurementFormset

    def build_initial_formset_factory(self):
        return forms.ResultMeasurementFormset(
            queryset=self.object.results.all(),
            assessment=self.assessment)

    def post_object_save(self, form, formset):
        for form in formset:
            form.instance.outcome = self.object


class OutcomeDelete(BaseDelete):
    success_message = "Outcome deleted."
    model = models.Outcome

    def get_success_url(self):
        self.parent = self.object.study_population
        return reverse("epi2:sp_detail", kwargs={"pk": self.parent.pk})


# Group collection + group
class GroupCollectionCreate(BaseCreateWithFormset):
    success_message = 'Groups created.'
    parent_model = models.StudyPopulation
    parent_template_name = 'study_population'
    model = models.GroupCollection
    form_class = forms.GroupCollection
    formset_factory = forms.GroupFormset

    def post_object_save(self, form, formset):
        for form in formset.forms:
            form.instance.collection = self.object

    def build_initial_formset_factory(self):
        return forms.BlankGroupFormset(queryset=models.Group.objects.none())


class GroupCollectionDetail(BaseDetail):
    model = models.GroupCollection


class GroupCollectionUpdate(BaseUpdateWithFormset):
    success_message = "Groups updated."
    model = models.GroupCollection
    form_class = forms.GroupCollection
    formset_factory = forms.GroupFormset

    def build_initial_formset_factory(self):
        return forms.GroupFormset(queryset=self.object.groups.all()
                                            .order_by('group_id'))

    def post_object_save(self, form, formset):
        for form in formset:
            form.instance.collection = self.object


class GroupCollectionDelete(BaseDelete):
    success_message = "Group collection deleted."
    model = models.GroupCollection

    def get_success_url(self):
        self.parent = self.object.study_population
        return reverse("epi2:sp_detail", kwargs={"pk": self.parent.pk})


class GroupDetail(BaseDetail):
    model = models.Group


class GroupUpdate(BaseUpdateWithFormset):
    success_message = "Groups updated."
    model = models.Group
    form_class = forms.SingleGroupForm
    formset_factory = forms.GroupNumericalDescriptionsFormset

    def build_initial_formset_factory(self):
        return forms.GroupNumericalDescriptionsFormset(
            queryset=self.object.descriptions.all())

    def post_object_save(self, form, formset):
        for form in formset:
            form.instance.group = self.object
