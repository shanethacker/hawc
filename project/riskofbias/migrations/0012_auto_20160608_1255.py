# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-06-08 17:55


from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('riskofbias', '0011_auto_20160606_1136'),
    ]

    operations = [
        migrations.AlterField(
            model_name='riskofbiasscore',
            name='score',
            field=models.PositiveSmallIntegerField(choices=[(10, 'Not reported'), (1, 'Definitely high risk of bias'), (2, 'Probably high risk of bias'), (3, 'Probably low risk of bias'), (4, 'Definitely low risk of bias'), (0, 'Not applicable')], default=10),
        ),
    ]
